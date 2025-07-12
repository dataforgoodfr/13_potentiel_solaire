from tqdm import tqdm

from potentiel_solaire.aggregate import aggregate_buildings_attachment_by_etablishment, aggregate_protection_by_etablishment, aggregate_solar_potential_by_etablishment
from potentiel_solaire.classes.results import DepartementResults
from potentiel_solaire.database.queries import update_buildings_attachment_for_schools, update_protection_for_schools, update_solar_potential_for_schools
from potentiel_solaire.logger import get_logger

logger = get_logger()


def load_buildings_attachment_results_to_db(codes_departement: list[str]):
    """Charge les resultats de rattachement des batiments aux etablissements scolaires dans la base de donnees.

    Args:
        codes_departement (list[str]): Liste des codes departement pour lesquels les resultats doivent etre charges.
    """
    for code_departement in tqdm(codes_departement):
        logger.info(f"Chargement des resultats de rattachement des batiments pour le departement {code_departement} dans la base de donnees")
        
        # Lecture des donnees calcules pour le departement
        results = DepartementResults(code_departement=code_departement)
        schools_establishments = results.load_gdf(layer="schools_establishments")
        schools_buildings = results.load_gdf(layer="schools_buildings")
        schools_educational_zones = results.load_gdf(layer="educational_zones")

        # Aggregation des resultats par etablissement
        schools_buildings_results = aggregate_buildings_attachment_by_etablishment(
            schools_establishments=schools_establishments,
            schools_buildings_results=schools_buildings,
            schools_educational_zones=schools_educational_zones
        )

        # Sauvegarde des resultats dans la base de donnees
        update_buildings_attachment_for_schools(
            results_by_school=schools_buildings_results,
        )



def load_protection_results_to_db(codes_departement: list[str]):
    """Charge les resultats de protection des etablissements scolaires dans la base de donnees.

    Args:
        codes_departement (list[str]): Liste des codes departement pour lesquels les resultats doivent etre charges.
    """

    for code_departement in tqdm(codes_departement):
        logger.info(f"Chargement des resultats de protection pour le departement {code_departement} dans la base de donnees")
        
        # Lecture des donnees calcules pour le departement
        results = DepartementResults(code_departement=code_departement)
        schools_establishments = results.load_gdf(layer="schools_establishments")
        schools_buildings_with_protection = results.load_gdf(layer="schools_buildings_with_protection")

        # Aggregation des resultats de protection par etablissement
        schools_protection_results = aggregate_protection_by_etablishment(
            schools_establishments=schools_establishments,
            schools_buildings_results=schools_buildings_with_protection
        )

        # Sauvegarde des resultats dans la base de donnees
        update_protection_for_schools(
            results_by_school=schools_protection_results,
        )


def load_solar_potential_results_to_db(codes_departement: list[str]):
    """Charge les resultats de potentiel solaire des etablissements scolaires dans la base de donnees.

    Args:
        codes_departement (list[str]): Liste des codes departement pour lesquels les resultats doivent etre charges.
    """

    for code_departement in tqdm(codes_departement):
        logger.info(f"Chargement des resultats de potentiel solaire pour le departement {code_departement} dans la base de donnees")
        
        # Lecture des donnees calcules pour le departement
        results = DepartementResults(code_departement=code_departement)
        schools_establishments = results.load_gdf(layer="schools_establishments")
        solar_potential_of_schools_buildings = results.load_gdf(layer="solar_potential_of_schools_buildings")

        # Aggregation des resultats de potentiel solaire par etablissement
        schools_solar_potential_results = aggregate_solar_potential_by_etablishment(
            schools_establishments=schools_establishments,
            schools_buildings_results=solar_potential_of_schools_buildings
        )

        # Sauvegarde des resultats dans la base de donnees
        update_solar_potential_for_schools(
            results_by_school=schools_solar_potential_results,
        )
    