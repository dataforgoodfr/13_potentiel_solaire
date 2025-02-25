import os
import re

import requests
from py7zr.py7zr import SevenZipFile

from potentiel_solaire.logger import get_logger

logger = get_logger()


def find_matching_files(
    folder_path: str,
    filename_pattern: str,
    folder_pattern: str
) -> list[str]:
    """Searches for files in the given folder that match the specified extension and regex pattern.

    :param folder_path: Path to the directory where files are searched.
    :param filename_pattern: The pattern of the file name
    :param folder_pattern: the pattern of the folder where is the file
    :return: List of matching file paths.
    """
    matching_files = []

    for parent, _, filenames in os.walk(folder_path):
        if re.search(folder_pattern, parent):
            for filename in filenames:
                if re.search(filename_pattern, filename):
                    matching_files.append(os.path.join(parent, filename))

    return matching_files


def download_file(
    url: str,
    output_filepath: str
):
    """Download a file from an url if it does not already exist.

    :param url: URL to download.
    :param output_filepath: Path to save the downloaded file.
    """
    filename = url.split('/')[-1]
    if not os.path.exists(output_filepath):
        logger.info(f"Downloading {filename}...")
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(output_filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"Downloaded {filename}")
        else:
            logger.error(f"Failed to download {filename}: {response.status_code}")
    else:
        logger.info(f"{filename} already exists, skipping download.")


def extract_7z(
    input_filepath: str,
    output_folder: str
):
    """Extract a .7z archive if it exists

    :param input_filepath: Path to file to unzip.
    :param output_folder: Path to folder where extracted files are saved."""
    if os.path.exists(input_filepath):
        logger.info(f"Extracting {input_filepath}...")
        with SevenZipFile(input_filepath, mode='r') as archive:
            archive.extractall(output_folder)
        logger.info(f"Extracted {input_filepath}")
    else:
        logger.info(f"File {input_filepath} not found, skipping extraction.")

