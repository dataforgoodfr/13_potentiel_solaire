import os
import re

import requests
from bs4 import BeautifulSoup
import geopandas as gpd

from potentiel_solaire.constants import BD_TOPO_DATE, BD_TOPO_PAGE, DATA_FOLDER, DEFAULT_CRS
from potentiel_solaire.sources.utils import download_file, extract_7z, find_matching_files
from potentiel_solaire.duckdb_manager import get_departements
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_urls_for_bd_topo(
    bd_topo_page: str = BD_TOPO_PAGE,
):
    """Get available urls for BD TOPO data
    
    :param bd_topo_page: url with all urls for BD TOPO
    :return: list of urls for BD TOPO
    """
    response = requests.get(bd_topo_page)
    soup = BeautifulSoup(response.text, "html.parser")

    return [element.get("href") for element in soup.find_all("a") if element.get("href")] 


def check_date_is_available_for_bd_topo(
    bd_topo_urls: list[str],
    date: str = BD_TOPO_DATE,
):
    """Get the last date for BD TOPO data
    
    :param bd_topo_urls: list of urls for BD TOPO
    :param date: date to check (YYYY-MM-DD)
    :return: True if date is available, False otherwise
    """
    gpkg_regex = (
        r"https?://.*BDTOPO.*TOUSTHEMES_GPKG.*D([A-Za-z0-9]{3})"
        r"_(19\d\d|20\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]).*\.7z"
    )

    dates_available = set()
    for url in bd_topo_urls:
        match = re.match(gpkg_regex, url)
        if match:
            year = match.group(2)
            month = match.group(3)
            day = match.group(4)
            dates_available.add(f"{year}-{month}-{day}")
    
    logger.info(
        "BD TOPO par departement au format GPKG disponible aux dates suivantes: %s", 
        dates_available
    )

    if date in dates_available:
        logger.info(
            "La BD TOPO par departement au format GPKG disponible a la date du %s",
            date
        )
        return True
    

    logger.warning(
        "La BD TOPO par departement au format GPKG n'est pas disponible a la date du %s",
        date
    )
    return False


def check_all_departements_available_for_bd_topo(
    bd_topo_urls_for_date: list[str],
):
    """Check if all departements are available for BD TOPO

    :param bd_topo_urls_for_date: list of urls for BD TOPO for a given date
    :return: True if all departements are available, False otherwise
    """
    # on recupere la liste des departements disponibles dans la database
    departements = get_departements()
    departements_available = set()

    # on recupere la liste des departements disponibles dans les urls
    for url in bd_topo_urls_for_date:
        match = re.match(r".*D([A-Za-z0-9]{3}).*", url)
        if match:
            departements_available.add(match.group(1))

    # on verifie que tous les departements sont disponibles
    for departement in departements:
        if departement not in departements_available:
            logger.warning(
                "Le departement %s n'est pas disponible pour la BD TOPO",
                departement
            )
            return False

    return True


def get_urls_for_bd_topo_gpkg(
    bd_topo_page: str = BD_TOPO_PAGE,
    date: str = BD_TOPO_DATE,
):
    """Get available urls for BD TOPO data at gpkg format for all departements

    :param bd_topo_page: url with all urls for BD TOPO
    :param date: date to check (YYYY-MM-DD)
    :return: list of urls for BD TOPO
    """
    bd_topo_urls = get_urls_for_bd_topo(bd_topo_page=bd_topo_page)
    logger.info("%s urls disponibles pour la BD TOPO", len(bd_topo_urls))

    # check si la date est disponible
    if not check_date_is_available_for_bd_topo(
        bd_topo_urls=bd_topo_urls,
        date=date
    ):
        raise ValueError(
            "La date {} n'est pas disponible pour la BD TOPO".format(date)
        )
    
    # on filtre les urls pour ne garder que celles qui sont a la date demandee
    gpkg_regex_with_date = rf"https?://.*BDTOPO.*TOUSTHEMES_GPKG.*D([A-Za-z0-9]{{3}})_{date}.*\.7z"
    bd_topo_urls_for_date = [
        href_element for href_element in bd_topo_urls if re.search(gpkg_regex_with_date, href_element)
    ]

    # check si tous les departements sont disponibles pour la date demandee
    if not check_all_departements_available_for_bd_topo(
        bd_topo_urls_for_date=bd_topo_urls_for_date
    ):
        raise ValueError(
            "Certains departements ne sont pas disponibles pour la BD TOPO a la date du {}"
            .format(date)
        )

    return bd_topo_urls_for_date


def get_url_for_bd_topo_gpkg_for_departement(
    code_departement: str,
    bd_topo_page: str = BD_TOPO_PAGE,
    date: str = BD_TOPO_DATE,
):
    """Get url to download BD TOPO data at gpkg format for the departement

    :param code_departement: code of departement
    :param bd_topo_page: url with all urls for BD TOPO
    :param date: date to check (YYYY-MM-DD)
    :return: url
    """
    gpkg_urls = get_urls_for_bd_topo_gpkg(
        bd_topo_page=bd_topo_page, 
        date=date
    )

    url = [url for url in gpkg_urls if re.search(rf"D{code_departement}", url)][0]
    logger.info("url for departement %s is %s", code_departement, url)

    return url


def find_gpkg_file_bd_topo(
    code_departement: str,
    date: str = BD_TOPO_DATE,
    data_directory: str = DATA_FOLDER,
):
    """Get filepath for the .gpkg file for a given departement

    :param code_departement: code of departement
    :param data_directory: folder where files are stored
    :return: filepath
    """
    # Get the last date for BD TOPO data
    files = find_matching_files(
        folder_path=data_directory,
        filename_pattern=r".gpkg",
        folder_pattern=rf"BDT.*D{code_departement}_{date}"
    )

    assert len(files) < 2, "More than one gpkg has been found for departement {} and date {}".format(
        code_departement, date
    )

    return files[0] if len(files) > 0 else None


def extract_bd_topo(
    code_departement: str,
    bd_topo_page: str = BD_TOPO_PAGE,
    date: str = BD_TOPO_DATE,
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
        date=date,
        data_directory=output_directory
    )
    if gpkg_filepath is not None:
        logger.info("gpkg file %s for departement %s already extracted",
                    gpkg_filepath, code_departement)
        return gpkg_filepath

    # get url for download
    url_departement = get_url_for_bd_topo_gpkg_for_departement(
        code_departement=code_departement,
        bd_topo_page=bd_topo_page,
        date=date
    )

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
        date=date,
        data_directory=output_directory
    )


def get_topo_zones_of_interest(
    bd_topo_path: str,
    geom_of_interest: gpd.GeoDataFrame,
    categories: list[str],
    natures: list[str],
    crs: int = DEFAULT_CRS
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
        "identifiants_sources",  # ID pour rattachement aux ecoles
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
    crs: int = DEFAULT_CRS
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

    buildings = gpd.read_file(
        bd_topo_path,
        mask=geom_of_interest,
        layer="batiment"
    )

    return buildings[columns].to_crs(crs)
