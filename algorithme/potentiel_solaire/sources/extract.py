from pathlib import Path

from potentiel_solaire.classes.source import load_sources, Source
from potentiel_solaire.constants import SOURCES_FILEPATH, DATA_FOLDER
from potentiel_solaire.sources.utils import download_file
from potentiel_solaire.logger import get_logger

logger = get_logger()


def extract_sources(
    sources_filepath: str = SOURCES_FILEPATH,
    output_directory: Path = DATA_FOLDER,
) -> dict[str, Source]:
    """Telecharge et stocke les sources de donnees si elles ne sont pas deja extraites.

    :param sources_filepath: Chemin du fichier YAML contenant les sources de donnees.
    :param output_directory: Repertoire de sortie ou les fichiers seront enregistres.
    :return dictionnaire des sources
    """
    sources = load_sources(sources_filepath=sources_filepath)

    for name, source in sources.items():
        filepath = output_directory / source.filename
        if filepath.exists():
            logger.info("source %s already extracted at %s", name, filepath)
        else: 
            download_file(url=source.url, output_filepath=filepath)

    return sources

if __name__ == "__main__":
    extract_sources()
