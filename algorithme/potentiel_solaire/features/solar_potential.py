import geopandas as gpd

from potentiel_solaire.features.solar_exposition import calculate_solar_exposition_building
from potentiel_solaire.features.roof_attributes import calculate_surface_utile
from potentiel_solaire.constants import RENDEMENT_PANNEAU_PV


def calculate_solar_potential(
    schools_buildings: gpd.GeoDataFrame,
    bd_irradiation_path: str,
    buffer_for_buildings_surroundings: int = 2000,
    rendement_panneau_pv: float = RENDEMENT_PANNEAU_PV
) -> gpd.GeoDataFrame:
    """Fonction principale pour calculer le potentiel solaire.

    :param schools_buildings: les batiments rataches a une ecole
    :param bd_irradiation_path: chemin du fichier .tif des donnees d irradiation
    :param buffer_for_buildings_surroundings: distance autour du batiment a prendre en compte
    :param rendement_panneau_pv: ration du rendement d un panneau solaire
    :return: le geodataframe des batiments scolaires avec les features de potentiel solaire
    """

    # Calcul de la surface totale au sol & zone de 2km autour des batiment
    crs_init = schools_buildings.crs
    schools_buildings = schools_buildings.to_crs(epsg=6933)  # pourquoi ? est-ce applicable aux DROMs ?
    schools_buildings["surface_totale_au_sol"] = schools_buildings.area
    schools_buildings["zone_autour_du_batiment"] = schools_buildings.buffer(
        distance=buffer_for_buildings_surroundings
    ).to_crs(crs_init)
    schools_buildings = schools_buildings.to_crs(crs_init)

    # Calcul de la surface utile
    schools_buildings["surface_utile"] = schools_buildings.apply(
       lambda building: calculate_surface_utile(
           surface_totale_au_sol=building["surface_totale_au_sol"]
       ), axis=1
    )

    # Calcul de l exposition solaire
    schools_buildings["rayonnement_solaire"] = schools_buildings.apply(
       lambda building: calculate_solar_exposition_building(
           zone_surrounding_building=building["zone_autour_du_batiment"],
           bd_irradiation_path=bd_irradiation_path
       ), axis=1
    )

    # Calcul potentiel solaire
    schools_buildings["potentiel_solaire"] = \
        schools_buildings["rayonnement_solaire"] * \
        schools_buildings["surface_utile"] * \
        rendement_panneau_pv

    # Ajout du tag batiments proteges ou en zone protegee
    schools_buildings["protection"] = schools_buildings.apply(
        lambda building: None, axis=1
    )  # TODO : a implementer

    return schools_buildings
