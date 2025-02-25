import os
import re

import requests
from bs4 import BeautifulSoup
import geopandas as gpd

from potentiel_solaire.constants import DATA_FOLDER, CRS
from potentiel_solaire.sources.utils import download_file, extract_7z, find_matching_files
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_urls_for_bd_topo_gpkg(
    bd_topo_page="https://geoservices.ign.fr/bdtopo",
    date="2024-12-15"
):
    """Get available urls for BD TOPO data at gpkg format for all departements

    :param bd_topo_page: url with all urls for BD TOPO
    :param date: date of BD TOPO data
    :return: list of urls for BD TOPO
    """
    response = requests.get(bd_topo_page)
    soup = BeautifulSoup(response.text, "html.parser")

    href_elements = [element.get("href") for element in soup.find_all("a") if element.get("href")]

    gpkg_regex = rf"https?://.*BDTOPO.*TOUSTHEMES_GPKG.*D[A-Za-z0-9]{{3}}_{date}.*\.7z"

    return [href_element for href_element in href_elements if re.search(gpkg_regex, href_element)]


def get_url_for_bd_topo_gpkg_for_departement(
    code_departement: str
):
    """Get url to download BD TOPO data at gpkg format for the departement

    :param code_departement: code of departement
    :return: url
    """
    gpkg_urls = get_urls_for_bd_topo_gpkg()
    logger.info("%s urls available for BD TOPO data per departement with GPKG format", len(gpkg_urls))

    url = [url for url in gpkg_urls if re.search(rf"{code_departement}", url)][0]
    logger.info("url for departement %s is %s", code_departement, url)

    return url


def find_gpkg_file_bd_topo(
    code_departement: str,
    data_directory: str = DATA_FOLDER,
):
    """ Get filepath for the .gpkg file for a given departement

    :param code_departement: code of departement
    :param data_directory: folder where files are stored
    :return: filepath
    """
    files = find_matching_files(
        folder_path=data_directory,
        filename_pattern=r".gpkg",
        folder_pattern=rf"BDT.*D{code_departement}"
    )

    assert len(files) < 2, f"More than one gpkg has been found for departement {code_departement}"

    return files[0] if len(files) > 0 else None


def extract_bd_topo(
    code_departement: str,
    output_directory: str = DATA_FOLDER,
):
    """Extrait les fichiers de la BD TOPO pour un departement

    :param code_departement: code du departement
    :param output_directory: dossier ou sauvegarder les fichiers
    :return: chemin du fichier .gpkg avec les donnees
    """
    # check if already extracted
    gpkg_filepath = find_gpkg_file_bd_topo(
        code_departement=code_departement,
        data_directory=output_directory
    )
    if gpkg_filepath is not None:
        logger.info("gpkg file %s for departement %s already extracted",
                    gpkg_filepath, code_departement)
        return gpkg_filepath

    # get url for download
    url_departement = get_url_for_bd_topo_gpkg_for_departement(code_departement=code_departement)

    # download zip file
    output_filename = url_departement.split('/')[-1]
    output_7z_filepath = os.path.join(output_directory, output_filename)
    download_file(url=url_departement, output_filepath=output_7z_filepath)

    # extract zip file
    extract_7z(input_filepath=output_7z_filepath, output_folder=output_directory)

    # delete zip file
    os.remove(output_7z_filepath)

    return find_gpkg_file_bd_topo(
        code_departement=code_departement,
        data_directory=output_directory
    )


def get_topo_zones_of_interest(
    bd_topo_path: str,
    geom_of_interest: gpd.GeoDataFrame,
    categories: list[str],
    natures: list[str],
    crs: int = CRS
) -> gpd.GeoDataFrame:
    """Filtre et renvoit les zones d activites de la BD TOPO

    :param bd_topo_path: chemin du fichier .gpkg de la BD TOPO
    :param geom_of_interest: geodataframe avec la geometrie d interet
    :param categories: categories a garder
    :param natures: natures a garder
    :param crs: projection de la gdf renvoyee
    :return: geodataframe avec les zones d activites filtrees
    """
    columns = [
        "cleabs",
        "categorie",
        "nature",
        "toponyme",
        "geometry"
    ]

    activity_zones = gpd.read_file(
        bd_topo_path,
        mask=geom_of_interest,
        layer="zone_d_activite_ou_d_interet"
    )

    educational_zones = activity_zones[
        (activity_zones["categorie"].isin(categories)) &
        (activity_zones["nature"].isin(natures))
    ]

    return educational_zones[columns].to_crs(crs)


def get_topo_buildings_of_interest(
    bd_topo_path: str,
    geom_of_interest: gpd.GeoDataFrame,
    crs: int = CRS
) -> gpd.GeoDataFrame:
    """Filtre et renvoit les batiments de la BD TOPO

    :param bd_topo_path: chemin du fichier .gpkg de la BD TOPO
    :param geom_of_interest: geodataframe avec la geometrie d interet
    :param crs: projection de la gdf renvoyee
    :return: geodataframe avec les batiments filtres
    """
    columns = [
        "cleabs",
        "construction_legere",
        "hauteur",
        "geometry"
    ]

    # TODO : add PCI buildings missing in TOPO database ?
    buildings = gpd.read_file(
        bd_topo_path,
        mask=geom_of_interest,
        layer="batiment"
    )

    return buildings[columns].to_crs(crs)
