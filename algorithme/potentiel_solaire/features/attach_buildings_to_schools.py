from typing import Tuple
import geopandas as gpd
import pandas as pd

from potentiel_solaire.constants import CRS_FOR_BUFFERS
from potentiel_solaire.logger import get_logger

logger = get_logger()


def merge_small_overlaping_zones_to_big_zone(
    educational_zones : gpd.GeoDataFrame,
    crs_for_distances: int = CRS_FOR_BUFFERS,
) -> gpd.GeoDataFrame:
    """Affecte les petites zones a la plus grande zone qui les contient.

    Si une zone n'est pas contenue dans une autre, on considere que la grande zone est elle-meme.
    
    :param educational_zones: zones d educations (BD TOPO)
    :param crs_for_distances: crs utilise pour le calcul en metres
    """    
    educational_zones["aire_zone"] = educational_zones.to_crs(crs_for_distances).geometry.area

    intersections = gpd.overlay(
        educational_zones[["cleabs", "aire_zone", "geometry"]].rename(columns={"cleabs": "cleabs_grande_zone", "aire_zone": "aire_grande_zone"}), 
        educational_zones[["cleabs", "aire_zone", "geometry"]].rename(columns={"cleabs": "cleabs_petite_zone", "aire_zone": "aire_petite_zone"}), 
        how="intersection",
    )

    intersections["aire_apres_intersection"] = intersections.to_crs(crs_for_distances).area

    small_overlaping_zones = intersections[
        (intersections["cleabs_grande_zone"] != intersections["cleabs_petite_zone"]) &
        (intersections["aire_petite_zone"].round() == intersections["aire_apres_intersection"].round())
    ].copy()

    educational_zones_merged = educational_zones.merge(
        small_overlaping_zones[["cleabs_grande_zone", "cleabs_petite_zone"]],
        left_on="cleabs",
        right_on="cleabs_petite_zone",
        how="left",
    )

    educational_zones_merged["cleabs_grande_zone"].fillna(educational_zones_merged["cleabs"], inplace=True)

    return educational_zones_merged


def attach_educational_zones_to_schools(
    schools_establishments: gpd.GeoDataFrame,
    educational_zones: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:
    """Determine les zones d education de chaque etablissement scolaire

    :param schools_establishments: annuraires des etablissements scolaires
    :param educational_zones: zones d educations (BD TOPO)
    :return: geodataframe des zones scolaires
    """
    # Preparation 'educational_zones'
    educational_zones = educational_zones.dropna(subset=["identifiants_sources"])
    educational_zones["identifiants_sources"] = educational_zones["identifiants_sources"].apply(
        lambda x: [y.strip() for y in str(x).replace("MEN:", "").split("/")]
    )
    educational_zones_explode = educational_zones.explode('identifiants_sources')

    # Rattachement
    educational_zones_attached_to_schools = educational_zones_explode.merge(
        schools_establishments[["identifiant_de_l_etablissement", "nombre_d_eleves"]],
        left_on='identifiants_sources',
        right_on='identifiant_de_l_etablissement',
        how="inner"
    )[["cleabs_grande_zone", "identifiant_de_l_etablissement", "nombre_d_eleves"]]

    # Cleanup
    educational_zones_attached_to_schools.dropna(subset=["cleabs_grande_zone", "identifiant_de_l_etablissement"], ignore_index=True, inplace=True)
    educational_zones_attached_to_schools.drop_duplicates(ignore_index=True, inplace=True)

    # On attache l etablissement a la grande zone
    big_zones_attached_to_schools = educational_zones.drop(columns=["cleabs_grande_zone"]).merge(
        educational_zones_attached_to_schools[
            ["cleabs_grande_zone", "identifiant_de_l_etablissement", "nombre_d_eleves"]
        ],
        left_on="cleabs",
        right_on="cleabs_grande_zone",
        how='inner'
    )

    return big_zones_attached_to_schools


def filter_buildings_mostly_outside_zone(
    buildings: gpd.GeoDataFrame,
    educational_zones: gpd.GeoDataFrame,
    crs_for_distances: int = CRS_FOR_BUFFERS,
):
    """On ne garde que les batiments qui sont a plus de 50% dans une zone d education.

    :param educational_zones: zones d educations (BD TOPO)
    :param buildings: batiments (BD TOPO)
    :param crs_for_distances: crs utilise pour le calcul en metres
    """
    # Calcul de l'aire totale des bâtiments 
    buildings['total_area'] = buildings['geometry'].to_crs(crs_for_distances).area
    
    # Intersection bâtiments/zone
    buildings_for_schools = gpd.overlay(
        buildings.rename(columns={"cleabs": "cleabs_bat"}), 
        educational_zones.rename(columns={"cleabs": "cleabs_zone"}), 
        how ='intersection'
    )
    
    # Calcul de l'aire des bâtiments présent dans la zone
    buildings_for_schools['area'] = buildings_for_schools['geometry'].to_crs(crs_for_distances).apply(lambda x :x.area)
    
    # Filtre pour ne récupérer que les bâtiments présents à plus de 50%
    buildings_to_keep = buildings_for_schools.loc[((buildings_for_schools['area']/buildings_for_schools['total_area'])*100) > 50]
    buildings_to_keep = pd.DataFrame(buildings_to_keep.drop(columns=["geometry"]))

    return buildings.merge(
        buildings_to_keep,
        left_on="cleabs",
        right_on="cleabs_bat",
        how='inner'
    ).drop(columns=["cleabs"])


def attach_buildings_to_schools(
    schools_establishments: gpd.GeoDataFrame,
    educational_zones: gpd.GeoDataFrame,
    buildings: gpd.GeoDataFrame,
    crs_for_distances: int = CRS_FOR_BUFFERS,
) -> Tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    """Determine les batiments de chaque etablissement scolaire

    :param schools_establishments: annuraires des etablissements scolaires
    :param educational_zones: zones d educations (BD TOPO)
    :param buildings: batiments (BD TOPO)
    :return: geodataframe des batiments scolaires et geodataframe des relations zones d'éducation - établissements scolaires
    """

    # Regroupement des petites zones dans les grandes
    educational_zones_merged = merge_small_overlaping_zones_to_big_zone(
        educational_zones=educational_zones,
        crs_for_distances=crs_for_distances,
    )
    
    # Rattachement des zones d education aux etablissements scolaires
    educational_zones_attached_to_schools = attach_educational_zones_to_schools(
        schools_establishments=schools_establishments,
        educational_zones=educational_zones_merged,
    )

    # Copie de la relation zones d'éducation - établissements scolaires
    schools_educational_zones = educational_zones_attached_to_schools[[
        "identifiant_de_l_etablissement", 
        "cleabs_grande_zone", 
        "identifiants_sources",
        "geometry"
    ]].copy()

    # On souhaite garder une seule zone par etablissement
    # En cas d'ambiguité (plusieurs établissements sur la meme grande zone), 
    # On affecte la grande zone à l'établissement qui a le plus d'élèves
    nb_schools_linked_to_zone = len(educational_zones_attached_to_schools["identifiant_de_l_etablissement"].unique())
    
    educational_zones_attached_to_schools.sort_values(
        by=["nombre_d_eleves"], ascending=False, inplace=True
    )
    educational_zones_attached_to_schools.drop_duplicates(
        subset=["cleabs_grande_zone"], keep='first', inplace=True
    )

    nb_schools_without_ambiguity = len(educational_zones_attached_to_schools["identifiant_de_l_etablissement"].unique())

    if nb_schools_without_ambiguity < nb_schools_linked_to_zone:
        logger.warning("{} ecoles partagent une zone d education avec d autres sur un total {} ({}%) et sont ecartees du calcul".format(
            nb_schools_linked_to_zone - nb_schools_without_ambiguity,
            nb_schools_linked_to_zone,
            round(100*(nb_schools_linked_to_zone - nb_schools_without_ambiguity) / (nb_schools_linked_to_zone)))
        )

    # On calcule le taux de couverture des zones d education
    educational_zone_total_area = educational_zones.dissolve().to_crs(crs_for_distances).area.iloc[0]
    education_zone_attached_area = educational_zones_attached_to_schools.dissolve().to_crs(crs_for_distances).area.iloc[0]
    logger.info("{}m² de zone deducation attachee a un etablissement sur un total de {}m² ({} %)".format(
                round(education_zone_attached_area), 
                round(educational_zone_total_area), 
                round(100 * (education_zone_attached_area / educational_zone_total_area)))
    )

    # On ne garde que les batiments qui sont majoritairement dans des zones affectees a une ecole
    schools_buildings = filter_buildings_mostly_outside_zone(
        buildings=buildings,
        educational_zones=educational_zones_attached_to_schools,
        crs_for_distances=crs_for_distances
    )

    return schools_buildings.drop_duplicates(subset=["cleabs_bat"]), schools_educational_zones
