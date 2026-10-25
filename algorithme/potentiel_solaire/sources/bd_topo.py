import os
import shutil

import geopandas as gpd

from potentiel_solaire.constants import BD_TOPO_DATE, BD_TOPO_RESOURCE_ID, DATA_FOLDER, DEFAULT_CRS
from potentiel_solaire.sources.geopf import get_geopf_download_links, get_geopf_resource_entries
from potentiel_solaire.sources.utils import download_file, extract_7z, find_matching_files
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_bd_topo_dataset_for_departement(
    code_departement: str,
    date: str = BD_TOPO_DATE,
) -> str:
    """Get the BD TOPO dataset (all themes, gpkg format) for the departement at the given date

    :param code_departement: code of departement
    :param date: edition date of the BD TOPO (YYYY-MM-DD)
    :return: title of the dataset on the Geoplateforme
    """
    entries = get_geopf_resource_entries(
        resource_id=BD_TOPO_RESOURCE_ID,
        zone=f"D{code_departement}",
        fmt="GPKG",
    )
    entries = [entry for entry in entries if "TOUSTHEMES_GPKG" in entry["title"]]

    dates_available = sorted({entry["edition_date"] for entry in entries})
    logger.info(
        "BD TOPO pour le departement %s au format GPKG disponible aux dates suivantes: %s",
        code_departement,
        dates_available
    )

    datasets = [entry["title"] for entry in entries if entry["edition_date"] == date]
    if len(datasets) == 0:
        raise ValueError(
            "La BD TOPO du departement {} n'est pas disponible a la date du {}"
            .format(code_departement, date)
        )

    logger.info("dataset for departement %s is %s", code_departement, datasets[0])
    return datasets[0]


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
    date: str = BD_TOPO_DATE,
    output_directory: str = DATA_FOLDER,
):
    """Extrait les fichiers de la BD TOPO pour un departement

    :param code_departement: code du departement
    :param date: date d edition de la BD TOPO (YYYY-MM-DD)
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

    # get urls for download (archive can be split in several parts .7z.001, .7z.002, ...)
    dataset_id = get_bd_topo_dataset_for_departement(
        code_departement=code_departement,
        date=date
    )
    urls = get_geopf_download_links(resource_id=BD_TOPO_RESOURCE_ID, dataset_id=dataset_id)
    if len(urls) == 0:
        raise ValueError(f"Aucun lien de telechargement trouve pour {dataset_id}")

    # download 7z file(s)
    parts_filepaths = []
    for url in urls:
        part_filepath = os.path.join(output_directory, url.split('/')[-1])
        download_file(url=url, output_filepath=part_filepath)
        parts_filepaths.append(part_filepath)

    # merge parts into a single 7z file
    output_7z_filepath = os.path.join(output_directory, f"{dataset_id}.7z")
    if parts_filepaths != [output_7z_filepath]:
        with open(output_7z_filepath, "wb") as output_file:
            for part_filepath in parts_filepaths:
                with open(part_filepath, "rb") as part_file:
                    shutil.copyfileobj(part_file, output_file)
                os.remove(part_filepath)

    # extract 7z file
    extract_7z(input_filepath=output_7z_filepath, output_folder=output_directory)

    # delete 7z file
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
