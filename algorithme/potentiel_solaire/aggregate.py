import geopandas as gpd


# En réalité, seul le calcul par établissement compte
# Le reste peut se compute en base de données (à ce stade, en tout cas)
def get_schools_etablissements_with_solar_potential(
    schools_establishments: gpd.GeoDataFrame,
    solar_potential_of_schools_buildings: gpd.GeoDataFrame
):
    return schools_establishments.merge(
        solar_potential_of_schools_buildings,
        how="left",
        on="identifiant_de_l_etablissement"
    ).copy()


def aggregate_solar_potential_by_etablishment(
    schools_establishments: gpd.GeoDataFrame,
    solar_potential_of_schools_buildings: gpd.GeoDataFrame
):
    """Aggrege les resultats de potentiel solaire par établissement

    :param schools_establishments: annuaire des etablissements scolaires
    :param solar_potential_of_schools_buildings: potentiel solaire a lechelle des batiments
    :return: geodataframe des resultats aggreges
    """
    solar_potential_of_schools_buildings = get_schools_etablissements_with_solar_potential(
        schools_establishments,
        solar_potential_of_schools_buildings
    )
    
    solar_potential_of_schools_buildings.loc[solar_potential_of_schools_buildings['surface_utile'].isna(), 'surface_utile'] = 0
    solar_potential_of_schools_buildings.loc[solar_potential_of_schools_buildings['potentiel_solaire'].isna(), 'potentiel_solaire'] = 0
    solar_potential_of_schools_buildings.loc[solar_potential_of_schools_buildings['protection'].isna(), 'protection'] = False

    return solar_potential_of_schools_buildings.groupby(by=["identifiant_de_l_etablissement"]).agg({
        "surface_utile": "sum",
        "potentiel_solaire": "sum",
        "protection": "any"  # Si un seul batiment est protégé, l'établissement est protégé.
    }).reset_index()
