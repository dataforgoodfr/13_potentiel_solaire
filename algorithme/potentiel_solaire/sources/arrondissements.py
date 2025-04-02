import os

import geopandas as gpd
import requests
import topojson as tp

from shapely import intersection, make_valid

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
    

def simplify_arrondissements(
    arrondissements: gpd.GeoDataFrame,
    epsilon: float = EPSILON_SIMPLIFICATION,
) -> gpd.GeoDataFrame:
    """
    Créé un jeu de données avec l'ensemble des communes composées d'arrondissements

    Args:
        output_directory (str, optional): . Defaults to DATA_FOLDER.
        epsilon (float): tolerance parameter for simplification
    
    Returns:
        Tuple(gpd.GeoDataFrame, list): Un tuple contenant un GeoDataFrame des communes et une liste des codes insee des
        communes qui sont des arrondissements
    """    
    # Simplify arrondissements
    topo = tp.Topology(arrondissements, topology=True, prequantize=False)
    simplified_arrondissements = topo.toposimplify(
        epsilon=epsilon,
        prevent_oversimplify=True,
    ).to_gdf()

    return simplified_arrondissements


def remove_holes_and_overlap_for_cities(
    arrondissements: gpd.GeoDataFrame, 
    cities: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """

    Args:
        cities: geometrie de la ville (sans arrondissements) qui fit bien avec les communes alentours
    """
    # On enleve les overlap sur les communes aux alentours
    arrondissements_no_overlap = arrondissements.overlay(
        cities, how="intersection"
    ).to_crs(arrondissements.crs)

    # On identifie les trous cree par la simplification
    holes = gpd.overlay(cities, arrondissements_no_overlap, how="difference").explode()[["geometry"]].to_crs(arrondissements.crs)

    # On affecte chaque trou a l arrondissement le plus proche
    map_holes_to_arrondissements = gpd.sjoin_nearest(
        holes,
        arrondissements_no_overlap,
        how="left",
    )[arrondissements_no_overlap.columns]

    # On enleve les trous affectes a plusieurs arrondissements
    # On choisi larrondissement pour lequel le trou partage le plus de surface
    map_holes_to_arrondissements["overlap_arrondissement_avec_buffer"] = map_holes_to_arrondissements.to_crs(6933).apply(
        lambda hole: intersection(
            make_valid(hole["geometry"]), 
            arrondissements_no_overlap[arrondissements_no_overlap["insee_arm"] == hole["insee_arm"]].to_crs(6933)["geometry"].buffer(50).iloc[0]
            ).area,
        axis=1
    )
    map_holes_to_arrondissements.sort_values(by="overlap_arrondissement_avec_buffer", inplace=True, ascending=False)
    map_holes_to_arrondissements["geometry"] = map_holes_to_arrondissements.normalize()
    map_holes_to_arrondissements.drop_duplicates(subset=["geometry"], keep="first", inplace=True)

    # On merge les geometries par arrondissement
    arrondissements_no_overlap_no_holes = arrondissements_no_overlap.merge(
        map_holes_to_arrondissements,
        how="outer"
    ).dissolve(by="insee_arm").reset_index()
    
    # On fait en sorte de n'avoir que des polygons valides
    arrondissements_no_overlap_no_holes["geometry"] = arrondissements_no_overlap_no_holes["geometry"].make_valid()
    arrondissements_no_overlap_no_holes = arrondissements_no_overlap_no_holes.explode()
    arrondissements_no_overlap_no_holes = arrondissements_no_overlap_no_holes.dissolve(by="insee_arm").reset_index()

    return arrondissements_no_overlap_no_holes[arrondissements.columns]


def create_arrondissements_geojson(output_directory: str = DATA_FOLDER) -> str:
    arrondissements = get_arrondissements()

    arrondissements_simplified = simplify_arrondissements(arrondissements)

    sources = load_sources()
    communes = gpd.read_file(sources["communes"].filepath)
    cities = communes[communes["codgeo"].isin(arrondissements["insee_com"].unique())]

    arrondissements_corrected = remove_holes_and_overlap_for_cities(
        arrondissements=arrondissements_simplified,
        cities=cities
    )

    filepath = os.path.join(output_directory, "arrondissements.geojson")
    arrondissements_corrected.to_file(filepath, driver="GeoJSON")

    return filepath


if __name__ == "__main__":
    create_arrondissements_geojson()
