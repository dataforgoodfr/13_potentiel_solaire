import random
import geopandas as gpd
from potentiel_solaire.sources.bd_irr import getIrradiationEcole
from potentiel_solaire.features.roof_attributes import getSurfaces
from potentiel_solaire.constants import RENDEMENT_PANNEAU_PV


def calculate_solar_potential(
    schools_buildings: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    # TODO: Calculs faux pour le moment
    schools_buildings = getSurfaces(schools_buildings)
    #schools_buildings["surface_utile"] = schools_buildings.apply(
    #    lambda building: surface_utile_grossiere(), axis=1
    #)

    schools_buildings["protection"] = schools_buildings.apply(
        lambda building: random.choice([True, False]), axis=1
    )

    schools_buildings = getIrradiationEcole(schools_buildings)
    #schools_buildings["rayonnement_solaire"] = schools_buildings.apply(
    #    lambda building: random.choice(range(0, 150)), axis=1
    #)

    schools_buildings["potentiel_solaire"] = \
        schools_buildings["rayonnement_solaire"] * \
        schools_buildings["surface_utile"] * \
        RENDEMENT_PANNEAU_PV

    #schools_buildings["potentiel_solaire"] = schools_buildings.apply(
    #    lambda building: random.choice(range(0, 1500)), axis=1
    #)

    return schools_buildings
