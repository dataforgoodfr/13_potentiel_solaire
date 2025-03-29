import os
import geopandas as gpd
import pandas as pd
import topojson as tp
from typing import Tuple

from potentiel_solaire.sources.utils import extract_7z
from potentiel_solaire.logger import get_logger
from potentiel_solaire.classes.source import load_sources
from potentiel_solaire.constants import SOURCES_FILEPATH, DATA_FOLDER, DEFAULT_CRS, DEP_AVEC_ARRONDISSEMENT, EPSILON_SIMPLIFICATION

logger = get_logger()

# Constantes pour les chemins des fichiers

SUB_PATH_ARRONDISSEMENTS = (
    "ADMIN-EXPRESS_3-2__SHP_WGS84G_FRA_2025-02-17/ADMIN-EXPRESS/"
    "1_DONNEES_LIVRAISON_2025-02-00188/ADE_3-2_SHP_WGS84G_FRA-ED2025-02-17/ARRONDISSEMENT_MUNICIPAL.shp"
)


def rename_columns(gdf: gpd.GeoDataFrame, mapping: dict) -> gpd.GeoDataFrame:
    """
    Renomme les colonnes d'un GeoDataFrame selon un mapping donné.
    """
    return gdf.rename(columns=mapping)[['geometry'] + list(mapping.values())]


def process_communes(communes_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Transforme les données géographiques des communes au format attendu.
    """
    return rename_columns(communes_gdf, {
        'INSEE_DEP': 'dep',
        'INSEE_COM': 'codgeo',
        'INSEE_REG': 'reg',
        'NOM': 'libgeo'
    })


def process_arrondissements(arrondissements_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Transforme les données des arrondissements au format des communes.
    """
    return rename_columns(arrondissements_gdf, {
        'INSEE_DEP': 'dep',
        'INSEE_ARM': 'codgeo',
        'INSEE_REG': 'reg',
        'NOM': 'libgeo'
    })


def extract_and_load_shapefile(extraction_folder: str, sub_path: str) -> gpd.GeoDataFrame:
    """
    Charge un fichier shapefile après extraction si nécessaire.
    """
    shapefile_path = os.path.join(extraction_folder, sub_path)
    return gpd.read_file(shapefile_path).set_crs(4326).to_crs(DEFAULT_CRS)


def extract_communes_arrondissement(department: str, output_directory: str = DATA_FOLDER)-> gpd.GeoDataFrame:
    """
    Extrait et traite les données géographiques des communes ou arrondissements d'un département.
    """
    sources = load_sources(SOURCES_FILEPATH)

    path_communes = os.path.join(output_directory, sources['communes'].filename)
    
    if not os.path.exists(path_communes):
        return None

    all_communes = gpd.read_file(path_communes)

    communes_gdf  = all_communes[all_communes['dep'] == department.lstrip('0')]

    # somehow there is a very small default on departement 013

    communes_gdf.geometry = communes_gdf.geometry.make_valid()
    
    return communes_gdf

def load_communes_avec_arrondissement(output_directory: str = DATA_FOLDER)-> Tuple[gpd.GeoDataFrame, list]:
    """
    Créé un jeu de données avec l'ensemble des communes composées d'arrondissements

    Args:
        output_directory (str, optional): . Defaults to DATA_FOLDER.
    
    Returns:
        Tuple(gpd.GeoDataFrame, list): Un tuple contenant un GeoDataFrame des communes et une liste des codes insee des
        communes qui sont des arrondissements
    """    

    sources = load_sources(SOURCES_FILEPATH)
    path_communes_geo_7z = os.path.join(output_directory, sources['communes_avec_arrondissments'].zip_filename)
    extraction_folder = path_communes_geo_7z[:-3]

    if not os.path.exists(extraction_folder):
        extract_7z(path_communes_geo_7z, extraction_folder)

    #codes that will have to be substracted from the communes
    codes_insee_com = []
    # Handle departments with arrondissements
    department_dfs = {}
    for dep_region in DEP_AVEC_ARRONDISSEMENT:
        dep_code = dep_region[0].lstrip('0')
                
        # Load and process arrondissements
        arrondissements_gdf = extract_and_load_shapefile(extraction_folder, SUB_PATH_ARRONDISSEMENTS)
        arrondissements_gdf = arrondissements_gdf[arrondissements_gdf['INSEE_ARM'].str.startswith(dep_code)]

        #get all the values for insee_om in a list
        insee_com = arrondissements_gdf['INSEE_COM'].values.tolist()
        codes_insee_com.extend(insee_com)
        arrondissements_gdf['INSEE_DEP'] = dep_region[0]
        arrondissements_gdf['INSEE_REG'] = dep_region[1]

        arrondissements_gdf = process_arrondissements(arrondissements_gdf)

        # Simplify arrondissements at EPSILON/10
        topo = tp.Topology(arrondissements_gdf, prequantize=False)
        simplified_arrondissements = topo.toposimplify(EPSILON_SIMPLIFICATION/300).to_gdf()
        department_dfs[dep_code] = simplified_arrondissements

    # Combine all departments and apply final simplification
    # Combine all department dataframes
    combined_gdf = pd.concat(list(department_dfs.values()), ignore_index=True)
    del department_dfs

    # Process the combined dataframe
    combined_gdf = process_communes(combined_gdf)

    # We simplify in two steps to avoid memory issues and ensure that the boundaries are respected
    topo = tp.Topology(combined_gdf, prequantize=False)
    communes_gdfs_final = topo.toposimplify(EPSILON_SIMPLIFICATION/10, prevent_oversimplify=True).to_gdf()

    topo = tp.Topology(communes_gdfs_final, prequantize=False)
    communes_gdfs_final = topo.toposimplify(EPSILON_SIMPLIFICATION, prevent_oversimplify=True).to_gdf()

    return communes_gdfs_final, codes_insee_com

def create_communes_dataset_with_arrondissement(output_directory: str = DATA_FOLDER):
    sources = load_sources(SOURCES_FILEPATH)

    communes_gdf = gpd.read_file(os.path.join(output_directory, sources['communes'].filename))

    arrondissements_gdf, codes_insee_com = load_communes_avec_arrondissement()

    #filter out the arrondissements that are parts of communes
    communes_gdf = communes_gdf[~communes_gdf['codgeo'].isin(codes_insee_com)]

    communes_gdf = pd.concat([communes_gdf, arrondissements_gdf], ignore_index=True)

    #drop duplicates on codgeo
    communes_gdf = communes_gdf.drop_duplicates(subset=['codgeo'])

    communes_gdf.to_file(os.path.join(output_directory, sources['communes'].filename))

    


