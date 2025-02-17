import os
import requests
import py7zr
import geopandas as gpd
from potentiel_solaire.constants import DATA_FOLDER
from potentiel_solaire.logger import get_logger

logger = get_logger()


def file_exists(filename, data_folder=DATA_FOLDER):
    """Check if the geojson file exists."""
    filepath = data_folder / filename
    return os.path.exists(filepath)


def folder_exists(filename, data_folder=DATA_FOLDER):
    """Check if the extracted 7z file exists."""
    folder_name = filename.replace('.7z', '')
    folder_path = data_folder / folder_name
    return os.path.exists(folder_path)


def download_file(url, filename, data_folder=DATA_FOLDER):
    """Download a file from a URL if it does not already exist."""
    filepath = data_folder / filename
    if not os.path.exists(filepath):
        logger.info(f"Downloading {filename}...")
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"Downloaded {filename}")
        else:
            logger.error(f"Failed to download {filename}: \
                         {response.status_code}")
    else:
        logger.info(f"{filename} already exists, skipping download.")


def extract_7z(filename, data_folder=DATA_FOLDER):
    """Extract a .7z archive if it exists."""
    filepath = data_folder / filename
    if os.path.exists(filepath):
        logger.info(f"Extracting {filename}...")
        with py7zr.SevenZipFile(filepath, mode='r') as archive:
            archive.extractall(data_folder)
        logger.info(f"Extracted {filename}")
    else:
        logger.info(f"File {filename} not found, skipping extraction.")


def delete_7z(filename, data_folder=DATA_FOLDER):
    """Delete a .7z archive if it exists."""
    filepath = data_folder / filename
    if os.path.exists(filepath):
        os.remove(filepath)
        logger.info(f"Deleted {filename}")
    else:
        logger.warning(f"File {filename} not found, skipping deletion.")


def convert_geojson_to_gpkg(geojson_filename, data_folder=DATA_FOLDER):
    """Convertir uniquement certains fichiers GeoJSON en GPKG."""
    files_to_convert = ["potentiel-gisement-solaire-brut-au-bati.geojson", "potentiel-solaire.geojson"]

    if geojson_filename not in files_to_convert:
        logger.info(f"Conversion ignorée pour {geojson_filename}, seuls {files_to_convert} sont concernés.")
        return

    geojson_path = data_folder / geojson_filename
    gpkg_filename = geojson_filename.replace(".geojson", ".gpkg")
    gpkg_path = data_folder / gpkg_filename

    if os.path.exists(geojson_path):
        logger.info(f"Conversion de {geojson_filename} en {gpkg_filename}...")
        gdf = gpd.read_file(geojson_path)
        gdf.to_file(gpkg_path, driver="GPKG")
        logger.info(f"Conversion terminée pour {geojson_filename}.")
    else:
        logger.warning(f"Le fichier {geojson_filename} n'existe pas, conversion annulée.")


def main():
    # Define file URLs and names
    files = [
        ("https://www.data.gouv.fr/fr/datasets/r/90b9341a-e1f7-4d75-a73c-bbc010c7feeb", "contour-des-departements.geojson"),
        ("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson", "fr-en-annuaire-education.geojson"),
        ("https://hub.arcgis.com/api/v3/datasets/21e83d3c0fb3411bbc9b673afce13a1c_26/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1", "potentiel-solaire.geojson"),
        ("https://data.smartidf.services/api/explore/v2.1/catalog/datasets/potentiel-gisement-solaire-brut-au-bati0/exports/geojson", "potentiel-gisement-solaire-brut-au-bati.geojson"),
        ("https://data.geopf.fr/telechargement/download/BDTOPO/BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15/BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15.7z", "BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15.7z"),
        ("https://data.geopf.fr/telechargement/download/PARCELLAIRE-EXPRESS/PARCELLAIRE-EXPRESS_1-1__SHP_LAMB93_D093_2024-10-01/PARCELLAIRE-EXPRESS_1-1__SHP_LAMB93_D093_2024-10-01.7z", "PARCELLAIRE-EXPRESS_1-1__SHP_LAMB93_D093_2024-10-01.7z"),
        ("https://data.geopf.fr/telechargement/download/ENR/ENR_1-0_POT-SOL-SOL_GPKG_LAMB93_FXX_2024-04-01/ENR_1-0_POT-SOL-SOL_GPKG_LAMB93_FXX_2024-04-01.7z","ENR_1-0_POT-SOL-SOL_GPKG_LAMB93_FXX_2024-04-01.7z"),
        ("https://data.geopf.fr/telechargement/download/MNS-CORREL/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01.7z","MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01.7z")
    ]

    for url, filename in files:
        if filename.endswith(".7z"):
            if not folder_exists(filename):
                download_file(url, filename)
                extract_7z(filename)
                delete_7z(filename)
            else:
                logger.info(f"Folder for {filename} already exists, skipping download and extraction.")
        elif filename.endswith(".geojson"):
            gpkg_filename = filename.replace(".geojson", ".gpkg")
            if filename in ["potentiel-gisement-solaire-brut-au-bati.geojson", "potentiel-solaire.geojson"]:
                if not file_exists(gpkg_filename):
                    if not file_exists(filename):
                        download_file(url, filename)
                    convert_geojson_to_gpkg(filename)
                else:
                    logger.info(f"GPKG file {gpkg_filename} already exists, skipping conversion.")
            else:
                if not file_exists(filename):
                    download_file(url, filename)
        else:
            download_file(url, filename)

if __name__ == "__main__":
    main()
