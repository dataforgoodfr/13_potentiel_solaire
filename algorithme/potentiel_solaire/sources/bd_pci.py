import os
import re

import requests
from bs4 import BeautifulSoup

from potentiel_solaire.constants import DATA_FOLDER
from potentiel_solaire.sources.utils import download_file, extract_7z, find_matching_files
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_urls_for_bd_pci_shp(
    bd_pci_page="https://geoservices.ign.fr/parcellaire-express-pci",
    date="2025-01-01"
):
    """Get available urls for BD PCI data at shp format for all departements

    :param bd_pci_page: url with all urls for BD PCI
    :param date: date of BD PCI data
    :return: list of urls for BD PCI
    """
    response = requests.get(bd_pci_page)
    soup = BeautifulSoup(response.text, "html.parser")

    href_elements = [element.get("href") for element in soup.find_all("a") if element.get("href")]

    shp_regex = rf"https?://.*PARCELLAIRE.*SHP_.*_D[A-Za-z0-9]{{3}}_{date}.*\.7z"

    return [href_element for href_element in href_elements if re.search(shp_regex, href_element)]


def get_url_for_bd_pci_shp_for_departement(
    code_departement: str
):
    """Get url to download BD PCI data at shp format for the departement

    :param code_departement: code of departement
    :return: url
    """
    shp_urls = get_urls_for_bd_pci_shp()
    logger.info("%s urls available for BD PCI data per departement with shp format", len(shp_urls))

    url = [url for url in shp_urls if re.search(rf"{code_departement}", url)][0]
    logger.info("url for departement %s is %s", code_departement, url)

    return url


def find_shp_file_bd_pci(
    code_departement: str,
    data_directory: str = DATA_FOLDER,
):
    """ Get filepath for the .shp file for a given departement

    :param code_departement: code of departement
    :param data_directory: folder where files are stored
    :return: filepath
    """
    files = find_matching_files(
        folder_path=data_directory,
        filename_pattern=r"BATIMENT.SHP",
        folder_pattern=rf"PEPCI.*D{code_departement}"
    )

    assert len(files) < 2, f"More than one shp has been found for departement {code_departement}"

    return files[0] if len(files) > 0 else None


def extract_bd_pci(
    code_departement: str,
    output_directory: str = DATA_FOLDER,
):
    """Extrait les fichiers de la BD PCI pour un departement

    :param code_departement: code du departement
    :param output_directory: dossier ou sauvegarder les fichiers
    :return: chemin du fichier .shp avec les donnees
    """
    # check if already extracted
    shp_filepath = find_shp_file_bd_pci(
        code_departement=code_departement,
        data_directory=output_directory
    )
    if shp_filepath is not None:
        logger.info("shp file %s for departement %s already extracted",
                    shp_filepath, code_departement)
        return shp_filepath

    # get url for download
    url_departement = get_url_for_bd_pci_shp_for_departement(code_departement=code_departement)
    # download zip file
    output_filename = url_departement.split('/')[-1]
    output_7z_filepath = os.path.join(output_directory, output_filename)
    download_file(url=url_departement, output_filepath=output_7z_filepath)

    # extract zip file
    extract_7z(input_filepath=output_7z_filepath, output_folder=output_directory)

    # delete zip file
    os.remove(output_7z_filepath)

    return find_shp_file_bd_pci(
        code_departement=code_departement,
        data_directory=output_directory
    )