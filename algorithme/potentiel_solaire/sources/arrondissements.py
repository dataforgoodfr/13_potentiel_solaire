import os

import geopandas as gpd
import requests
import topojson as tp


from potentiel_solaire.logger import get_logger
from potentiel_solaire.classes.source import load_sources
from potentiel_solaire.constants import SOURCES_FILEPATH, DATA_FOLDER, DEFAULT_CRS, DEP_AVEC_ARRONDISSEMENT, EPSILON_SIMPLIFICATION

logger = get_logger()


def get_arrondissements() -> gpd.GeoDataFrame:
    """Renvoit les arrondissements des departements avec des arrondissements"""
    sources = load_sources(SOURCES_FILEPATH)

    departements = gpd.read_file(sources["departements"].filepath).to_crs(4326)

    geom_of_interest = departements[departements["dep"].isin(DEP_AVEC_ARRONDISSEMENT)].dissolve()

    xmin, ymin, xmax, ymax = geom_of_interest.geometry.bounds.loc[0]

    url = "https://data.geopf.fr/wfs/ows"
    params = {
        "service": "WFS",
        "request": "GetFeature",
        "version": "2.0.0",
        "typename": "ADMINEXPRESS-COG.LATEST:arrondissement_municipal",
        "srsname": "EPSG:4326",
        "outputFormat": "application/json",
        "bbox": f"{xmin},{ymin},{xmax},{ymax},EPSG:4326",
    }

    response = requests.get(url, params=params)
    arrondissements = gpd.GeoDataFrame.from_features(response.json()).set_crs(DEFAULT_CRS)
    arrondissements.geometry = arrondissements.geometry.make_valid()

    return arrondissements
    

def simplify_arrondissements(arrondissements: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Créé un jeu de données avec l'ensemble des communes composées d'arrondissements

    Args:
        output_directory (str, optional): . Defaults to DATA_FOLDER.
    
    Returns:
        Tuple(gpd.GeoDataFrame, list): Un tuple contenant un GeoDataFrame des communes et une liste des codes insee des
        communes qui sont des arrondissements
    """    
    # Simplify arrondissements
    topo = tp.Topology(arrondissements, prequantize=False)
    simplified_arrondissements = topo.toposimplify(EPSILON_SIMPLIFICATION/300).to_gdf()

    # We simplify in two steps to avoid memory issues and ensure that the boundaries are respected
    topo = tp.Topology(simplified_arrondissements, prequantize=False)
    arrondissements_final = topo.toposimplify(EPSILON_SIMPLIFICATION/10, prevent_oversimplify=True).to_gdf()

    topo = tp.Topology(arrondissements_final, prequantize=False)
    arrondissements_final = topo.toposimplify(EPSILON_SIMPLIFICATION, prevent_oversimplify=True).to_gdf()

    return arrondissements_final


def create_arrondissements_geojson(output_directory: str = DATA_FOLDER) -> str:
    arrondissements = get_arrondissements()

    arrondissements_simplified = simplify_arrondissements(arrondissements)

    filepath = os.path.join(output_directory, "arrondissements.geojson")
    arrondissements_simplified.to_file(filepath, driver="GeoJSON")

    return filepath


if __name__ == "__main__":
    create_arrondissements_geojson()
