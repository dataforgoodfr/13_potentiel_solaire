from pathlib import Path


# path
ALGORITHME_FOLDER = Path(__file__).parent.parent
DATA_FOLDER = ALGORITHME_FOLDER / 'data'
DATABASE_FOLDER = ALGORITHME_FOLDER / 'database'
RESULTS_FOLDER = DATA_FOLDER / 'results'
RESULTS_FOLDER.mkdir(exist_ok=True)

SCHOOLS_ESTABLISHMENTS_FILENAME = "fr-en-annuaire-education.geojson"
COMMUNES_GEOMETRIES_FILENAME = "communes.json"
DEPARTEMENTS_GEOMETRIES_FILENAME = "departements.json"
REGIONS_GEOMETRIES_FILENAME = "regions.json"

DUCK_DB_PATH = DATABASE_FOLDER / 'potentiel_solaire.duckdb'

# projections
DEFAULT_CRS = 4326
CRS_FOR_BUFFERS = 6933

# hypotheses
BUFFER_SIZE_FOR_PROTECTED_BUILDINGS = 500  # meters
