from potentiel_solaire.features.solar_potential import calculate_solar_potential
from tqdm import tqdm

from potentiel_solaire.classes.results import DepartementResults
from potentiel_solaire.classes.source import load_sources
from potentiel_solaire.constants import DEFAULT_CRS
from potentiel_solaire.features.attach_buildings_to_schools import attach_buildings_to_schools
from potentiel_solaire.features.protected_tag import add_protected_tag_for_buildings
from potentiel_solaire.sources.bd_topo import find_gpkg_file_bd_topo, get_topo_buildings_of_interest, get_topo_zones_of_interest
from potentiel_solaire.sources.protected_buildings import get_areas_with_protected_buildings
from potentiel_solaire.logger import get_logger

logger = get_logger()


def calculate_attach_buildings_to_schools(codes_departement: list[str]):
    """Attache les batiments et zones scolaires aux etablissements scolaires pour plusieurs departements.

    Args:
        codes_departement (list[str]): Liste des codes des départements à traiter.
    """
    for code_departement in tqdm(codes_departement):
        # Lecture des donnees extraites pour le departement
        results = DepartementResults(code_departement=code_departement)
        bd_topo_path = find_gpkg_file_bd_topo(code_departement=code_departement)
        geom_of_interest = results.load_gdf(layer="geom_of_interest")
        schools_establishments = results.load_gdf(layer="schools_establishments")
        nb_schools = schools_establishments.shape[0]

        # Determination des zone scolaires associees
        educational_zones = get_topo_zones_of_interest(
            bd_topo_path=bd_topo_path,
            geom_of_interest=geom_of_interest,
            categories=["Science et enseignement"],
            natures=['Collège', 'Lycée', 'Enseignement primaire'],
            crs=DEFAULT_CRS
        )
        nb_educational_zones = educational_zones.shape[0]
        logger.info("Nb de zones d'éducations (D%s): %s", code_departement, nb_educational_zones)

        # Determination des batiments sur la geometrie d'interet
        buildings = get_topo_buildings_of_interest(
            bd_topo_path=bd_topo_path,
            geom_of_interest=geom_of_interest,
            crs=DEFAULT_CRS
        )
        nb_buildings = buildings.shape[0]
        logger.info("Nb de batiments (D%s): %s", code_departement, nb_buildings)

        # Attachement des batiments et zones scolaires aux etablissements scolaires
        schools_buildings, schools_educational_zones = attach_buildings_to_schools(
            schools_establishments=schools_establishments,
            educational_zones=educational_zones,
            buildings=buildings
        )
        nb_schools_buildings = schools_buildings.shape[0]
        logger.info("Nb de batiments scolaires (D%s): %s", code_departement, nb_schools_buildings)

        nb_schools_with_buildings = len(schools_buildings.identifiant_de_l_etablissement.unique())
        logger.info("Nb d'établissements scolaires avec des batiments (D{}): {} ({}%)".format(
            code_departement,
            nb_schools_with_buildings,
            round(100 * nb_schools_with_buildings / nb_schools)
        ))

        # Sauvegarde des resultats
        results.save_gdf(
            gdf=schools_educational_zones,
            layer="educational_zones"
        )
        results.save_gdf(
            gdf=schools_buildings,
            layer="schools_buildings"
        )


def calculate_protection_for_buildings(codes_departement: list[str]):
    """Determination des batiments scolaires en zone protegee pour plusieurs departements.

    Args:
        codes_departement (list[str]): Codes des departements pour lesquels les donnees doivent etre transformees.
    """
    sources = load_sources()

    for code_departement in tqdm(codes_departement):
        logger.info(f"Traitement du departement {code_departement} pour le calcul du tag de protection")

        # Lecture des donnees extraites pour le departement
        results = DepartementResults(code_departement=code_departement)
        geom_of_interest = results.load_gdf(layer="geom_of_interest")
        schools_buildings = results.load_gdf(layer="schools_buildings")

        # Determination des zones avec des batiments proteges
        areas_with_protected_buildings = get_areas_with_protected_buildings(
            bd_protected_buildings_path=sources["immeubles_proteges"].filepath,
            geom_of_interest=geom_of_interest,
            crs=DEFAULT_CRS
        )
        nb_areas_with_protected_buildings = areas_with_protected_buildings.shape[0]
        logger.info(
            "Nb de zones avec des batiments proteges (D%s): %s", 
            code_departement, 
            nb_areas_with_protected_buildings
        )

        # Ajout du tag batiments proteges ou en zone protegee
        schools_buildings = add_protected_tag_for_buildings(
            schools_buildings=schools_buildings,
            areas_with_protected_buildings=areas_with_protected_buildings
        )

        nb_buildings_protected = schools_buildings[schools_buildings["protection"]].shape[0]
        nb_schools_buildings = schools_buildings.shape[0]
        ratio_protected = round(100 * nb_buildings_protected / nb_schools_buildings)
        logger.info(
            "Nb de batiments protégés (D{}): {} ({})%)".format(
                code_departement, 
                nb_buildings_protected,
                ratio_protected
            )
        )

        # Sauvegarde des resultats
        results.save_gdf(
            gdf=areas_with_protected_buildings,
            layer="areas_with_protected_buildings"
        )
        results.save_gdf(
            gdf=schools_buildings,
            layer="schools_buildings_with_protection"
        )


def calculate_solar_potential_for_buildings(codes_departement: list[str]):
    """Calcul du potentiel solaire pour les batiments scolaires dans plusieurs departements.

    Args:
        codes_departement (list[str]): Codes des departements pour lesquels les donnees doivent etre transformees.
    """
    for code_departement in tqdm(codes_departement):
        logger.info(f"Traitement du departement {code_departement} pour le calcul du potentiel solaire")

        # Lecture des donnees extraites pour le departement
        results = DepartementResults(code_departement=code_departement)
        schools_buildings = results.load_gdf(layer="schools_buildings")
        geom_of_interest = results.load_gdf(layer="geom_of_interest")

        # Calcul du potentiel solaire
        solar_potential_of_schools_buildings = calculate_solar_potential(
            schools_buildings=schools_buildings,
            geom_of_interest=geom_of_interest
        )
        total_surface_au_sol = solar_potential_of_schools_buildings["surface_totale_au_sol"].sum()
        total_surface_utile = solar_potential_of_schools_buildings["surface_utile"].sum()
        total_potentiel_solaire = solar_potential_of_schools_buildings["potentiel_solaire"].sum()
        logger.info(
            "Pour le departement D%s : surface totale au sol: %s m², surface utile: %s m², potentiel solaire: %s kWh/an",
            code_departement,
            round(total_surface_au_sol),
            round(total_surface_utile),
            round(total_potentiel_solaire)
        )

        # Sauvegarde des resultats
        results.save_gdf(
            gdf=solar_potential_of_schools_buildings,
            layer="solar_potential_of_schools_buildings"
        )
