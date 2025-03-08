import pandas as pd
import geopandas as gpd
from thefuzz.fuzz import token_sort_ratio

from potentiel_solaire.logger import get_logger

logger = get_logger()


def attach_buildings_schools_id_men(
    schools_establishments: gpd.GeoDataFrame,
        educational_zones: gpd.GeoDataFrame,
    ) -> gpd.GeoDataFrame:
    """@TODO DOCSTRING"""
    # Preparation 'educational_zones'
    educational_zones = educational_zones.dropna(subset=["identifiants_sources"])
    educational_zones["identifiants_sources"] = educational_zones["identifiants_sources"].apply(lambda x: [y.strip() for y in str(x).replace("MEN:","").split("/")])
    educational_zones = educational_zones.explode('identifiants_sources')

    # Recollement
    educational_zones_attached_to_schools = pd.merge(
        educational_zones,
        schools_establishments[["identifiant_de_l_etablissement","nom_etablissement"]],
        left_on='identifiants_sources', right_on='identifiant_de_l_etablissement',
        how="inner")
    # Cleanup
    educational_zones_attached_to_schools = educational_zones_attached_to_schools.dropna(subset=["cleabs","identifiants_sources"])
    return educational_zones_attached_to_schools


def attach_buildings_to_schools(
    schools_establishments: gpd.GeoDataFrame,
    educational_zones: gpd.GeoDataFrame,
    buildings: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:
    """Determine les batiments de chaque etablissement scolaire

    :param schools_establishments: annuraires des etablissements scolaires
    :param educational_zones: zones d educations (BD TOPO)
    :param buildings: batiments (BD TOPO)
    :return: geodataframe des batiments scolaires
    """

    educational_zones_attached_to_schools = attach_buildings_schools_id_men(schools_establishments, educational_zones)

    # On ne garde que les batiments qui sont dans des zones affectees a une ecole
    buildings_for_schools = gpd.sjoin(
        buildings,
        educational_zones_attached_to_schools,
        how='inner',
        predicate='intersects',
        lsuffix='bat',
        rsuffix='zone'
    )

    return buildings_for_schools
