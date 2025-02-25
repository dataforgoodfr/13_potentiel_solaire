import pandas as pd
import geopandas as gpd
from thefuzz.fuzz import token_sort_ratio

from potentiel_solaire.logger import get_logger

logger = get_logger()


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
    # TODO: faire le rapprochement par type detablissement
    # type_etablissement_nature_mapping = {
    #     "Ecole": "Collège",
    #     "Lycée": "Lycée",
    #     "Collège": "Enseignement primaire"
    # }

    # Pour chaque ecole on regarde la zone d education la plus proche
    nearest_educational_zones_for_schools = gpd.sjoin_nearest(
        schools_establishments,
        educational_zones,
        how='inner',
        distance_col="distances",
        exclusive=True
    )

    # On calcule la proximite du nom_etablissement de lannuraire des etablissements scolaires
    # avec le toponyme renseigne pour la zone d education de la BD TOPO
    nearest_educational_zones_for_schools["proximite"] = nearest_educational_zones_for_schools.apply(
        lambda row: token_sort_ratio(row["nom_etablissement"], row["toponyme"]), axis=1
    )

    # On filtre les ecoles trop loin d une zone d education
    # On filtre les ecoles et zones qui ont un nom et toponyme trop differents
    schools_with_educational_zones = nearest_educational_zones_for_schools[
        (nearest_educational_zones_for_schools["distances"] < 0.0002) &
        (nearest_educational_zones_for_schools["proximite"] > 70)
    ].copy()
    schools_with_educational_zones.sort_values(by="proximite", inplace=True, ascending=False)

    # On fait en sorte de ne pas avoir plusieurs ecoles avec la meme zone deducation
    schools_with_educational_zones = schools_with_educational_zones.drop_duplicates(
        subset="cleabs", keep="first"
    )

    # TODO : comment faire le ratachement pour autres etablissements scolaires ?

    # On ne garde que les zones d education pour lesquelles une ecole a ete affectee
    educational_zones_attached_to_schools = pd.merge(
        educational_zones,
        schools_with_educational_zones[["cleabs", "identifiant_de_l_etablissement"]],
    )

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
