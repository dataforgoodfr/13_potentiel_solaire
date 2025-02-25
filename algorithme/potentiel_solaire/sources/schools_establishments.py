import os

import geopandas as gpd

from potentiel_solaire.constants import DATA_FOLDER, SCHOOLS_ESTABLISHMENTS_FILENAME, CRS
from potentiel_solaire.sources.utils import download_file
from potentiel_solaire.logger import get_logger

logger = get_logger()


def extract_schools_establishments(
    output_filename: str = SCHOOLS_ESTABLISHMENTS_FILENAME,
    output_directory: str = DATA_FOLDER,
):
    """Extrait les donnees des etablissements scolaires francais

    :param output_filename: nom du fichier cree
    :param output_directory: dossier ou est sauvegarde le fichier
    :return: le chemin du fichier cree
    """
    filepath = os.path.join(output_directory, output_filename)
    if os.path.exists(filepath):
        logger.info("file %s for french schools already extracted", filepath)
        return filepath

    url = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson"
    download_file(url=url, output_filepath=filepath)

    return filepath


def get_schools_establishments_of_interest(
    schools_filepath: str,
    code_departement: str,
    types_etablissements: list[str],
    statut_public_prive: str,
    etat: str,
    crs: int = CRS
) -> gpd.GeoDataFrame:
    """Filtre et renvoit l annuaire des etablissements scolaires francais

    :param schools_filepath: chemin du fichier avec les donnees des etablissements
    :param code_departement: pour garder les etablissement du departement
    :param types_etablissements: liste des types a garder (Ex: College, ...)
    :param statut_public_prive: statut a garder (ex: Public)
    :param etat: etat de l etablissement (ex: OUVERT)
    :param crs: projection de la gdf renvoyee
    :return: geodataframe des etablissements scolaires filtres
    """
    columns = [
        "identifiant_de_l_etablissement",
        "nom_etablissement",
        "type_etablissement",
        "libelle_nature",
        "statut_public_prive",
        "code_commune",
        "nom_commune",
        "code_departement",
        "libelle_departement",
        "code_region",
        "libelle_region",
        "etat",
        "etablissement_mere",
        "geometry"
    ]

    schools_establishments = gpd.read_file(schools_filepath)
    return schools_establishments[
        (schools_establishments["code_departement"] == code_departement) &
        (schools_establishments["type_etablissement"].isin(types_etablissements)) &
        (schools_establishments["statut_public_prive"] == statut_public_prive) &
        (schools_establishments["etat"] == etat)
        ][columns].to_crs(crs)
