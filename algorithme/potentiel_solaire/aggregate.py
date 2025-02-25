import random

import geopandas as gpd


def aggregate_solar_potential_by(
    schools_establishments: gpd.GeoDataFrame,
    solar_potential_of_schools_buildings: gpd.GeoDataFrame,
    group_by: list[str]
):
    """Aggrege les resultats de potentiel solaire.

    :param schools_establishments: annuaire des etablissements scolaires
    :param solar_potential_of_schools_buildings: potentiel solaire a lechelle des batiments
    :param group_by: colonnes sur lesquelles il faut aggreger
    :return: geodataframe des resultats aggreges
    """

    # TODO : les aggregations sont tres problablement a revoir / modifier

    solar_potential_of_schools_buildings = schools_establishments.merge(
        solar_potential_of_schools_buildings,
        how="left",
        on="identifiant_de_l_etablissement"
    ).copy()

    aggregated = solar_potential_of_schools_buildings.groupby(by=group_by).agg({
        "surface_utile": "sum",
        "rayonnement_solaire": "mean",  # TODO : quelle aggregation pour commune, departement et region ?
        "potentiel_solaire": "sum",
        "protection": "any"  # TODO : quelle aggregation pour commune, departement et region ?
    }).reset_index()

    aggregated["potentiel_solaire_categorie"] = aggregated.apply(
        lambda building: random.choice(["important", "intermediaire", "faible", "non_favorable"]), axis=1
    )  # TODO: pertinent uniquement a la maille dun etablissement ?

    return schools_establishments.dissolve(by=group_by).merge(
        aggregated,
        on=group_by,
        how="left",
    )[[*group_by, "surface_utile", "rayonnement_solaire", "potentiel_solaire", "protection", "geometry"]]
