import geopandas as gpd

from shapely.geometry import Point

from potentiel_solaire.features.pvgis_api import get_potentiel_solaire_from_pvgis_api
from potentiel_solaire.logger import get_logger
from potentiel_solaire.features.protected_tag import link_protected_buildings
from potentiel_solaire.constants import (
    CRS_FOR_BUFFERS
)

logger = get_logger()


def calculate_solar_potential(
    schools_buildings: gpd.GeoDataFrame,
    areas_with_protected_buildings: gpd.GeoDataFrame,
    geom_of_interest: gpd.GeoDataFrame,
    crs_for_buffers: int = CRS_FOR_BUFFERS
) -> gpd.GeoDataFrame:
    """Fonction principale pour calculer le potentiel solaire.

    :param schools_buildings: les batiments rataches a une ecole
    :param areas_with_protected_buildings: gdf des zones avec des batiments proteges
    :param geom_of_interest: geodataframe avec la geometrie d interet
    :param crs_for_buffers: crs utilise pour le calcul des buffers (en metres)
    :return: le geodataframe des batiments scolaires avec les features de potentiel solaire et le
    productible annuel estimé par l'API PVGIS.
    """
    # Calcul de la surface totale au sol
    crs_init = schools_buildings.crs
    schools_buildings = schools_buildings.to_crs(epsg=crs_for_buffers)
    schools_buildings["surface_totale_au_sol"] = schools_buildings.area
    schools_buildings = schools_buildings.to_crs(crs_init)

    # Calcul de la surface de toit utile
    schools_buildings["surface_utile"] = schools_buildings.apply(
       lambda building: calculate_surface_utile(
           surface_totale_au_sol=building["surface_totale_au_sol"]
       ), axis=1
    )
    
    # Calcul de la capacité installé
    schools_buildings["peakpower"] = schools_buildings.apply(
        lambda building: calculate_installed_capacity(
            rooftop_surface=building["surface_utile"]
        ), axis=1
    )

    # On prend comme longitude et latitude du batiment le plus proche du centre de la geometrie d interet
    center = Point(geom_of_interest.centroid.x, geom_of_interest.centroid.y)
    schools_buildings["distance_to_center"] = schools_buildings.geometry.distance(center)
    closest_building = schools_buildings.loc[schools_buildings["distance_to_center"].idxmin()].geometry
    longitude = closest_building.centroid.x
    latitude = closest_building.centroid.y

    # On calcul le potentiel solaire pour 1kW de puissance installee via l'API PVGIS
    potentiel_solaire_unitaire = get_potentiel_solaire_from_pvgis_api(
        longitude=longitude,
        latitude=latitude,
        peakpower=1
    )

    # On le multiplie par le peakpower de chaque batiment
    schools_buildings["potentiel_solaire"] = potentiel_solaire_unitaire * schools_buildings["peakpower"]

    # Ajout du tag batiments proteges ou en zone protegee
    schools_buildings["protection"] = schools_buildings.apply(
        lambda building: link_protected_buildings(
            building=building["geometry"],
            areas_with_protected_buildings=areas_with_protected_buildings
        ), axis=1
    )

    return schools_buildings


def calculate_surface_utile(surface_totale_au_sol: float):
    """Calcule la surface utile pour le PV.

    Pour le moment il s agit d'un simple ratio.
    @TODO Remplacer par une formule plus fine

    :param surface_totale_au_sol: surface totale au sol du batiment
    :return: la surface utile pour installation de panneaux PV
    """
    if surface_totale_au_sol <= 100:
        return 0

    if 100 < surface_totale_au_sol < 500:
        ratio = 0.4 * surface_totale_au_sol / 5000 + 0.2
        return ratio * surface_totale_au_sol

    return 0.6 * surface_totale_au_sol


def calculate_installed_capacity(rooftop_surface: float) -> float:
    """
    Transform useable surface into installed capacity (peakpower), with assumption that a 
    typical PV panel produces 225W/m2, as per some modules here https://www.csisolar.com/module/.
    """
    return rooftop_surface * 225 / 1_000  # in kW
