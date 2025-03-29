import yaml
from dataclasses import dataclass, field
from typing import Optional
from potentiel_solaire.constants import DATA_FOLDER, SOURCES_FILEPATH

@dataclass
class Source:
    """Représente une source de donnees avec ses métadonnées.

    Attributes:
    - name (str) : Nom unique de la source.
    - url (str) : URL ou recuperer les donnees.
    - filename (str) : Nom du fichier local dans lequel les donnees seront stockees.
    - description (str) : Breve description de la source.
    - zip_filename (Optional[str]) : Nom optionnel du fichier ZIP contenant les donnees.
    """
    name: str
    url: str
    filename: str
    description: str
    zip_filename: Optional[str] = field(default=None)

    @property
    def filepath(self):
        """Retourne le chemin complet du fichier ou les donnees seront enregistrees.

        :return: Chemin absolu vers le fichier local.
        """
        return DATA_FOLDER / self.filename

    @property
    def zip_filepath(self):
        """Retourne le chemin complet du fichier ZIP si disponible."""
        return DATA_FOLDER / self.zip_filename if self.zip_filename else None

def load_sources(sources_filepath: str = SOURCES_FILEPATH) -> dict[str, Source]:
    """Charge un fichier YAML et le convertit en un dictionnaire de sources de donnees.

    :param sources_filepath: Chemin vers le fichier YAML contenant les definitions des sources.
    :return: Un dictionnaire ou les cles sont les noms des sources
      et les valeurs sont des objets de la classe Source.
    """
    with open(sources_filepath, "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    sources = {
        name: Source(name=name, **details)
        for name, details in data.items()
    }
    return sources
