from pathlib import Path


# path
ALGORITHME_FOLDER = Path(__file__).parent.parent
DATA_FOLDER = ALGORITHME_FOLDER / 'data'
DATABASE_FOLDER = ALGORITHME_FOLDER / 'database'
RESULTS_FOLDER = DATA_FOLDER / 'results'
RESULTS_FOLDER.mkdir(exist_ok=True)

SOURCES_FILEPATH = DATA_FOLDER / "sources.yaml"

DUCK_DB_PATH = DATABASE_FOLDER / 'potentiel_solaire.duckdb'

# BD TOPO
BD_TOPO_PAGE = "https://geoservices.ign.fr/bdtopo"
BD_TOPO_DATE = "2025-03-15"

# projections
DEFAULT_CRS = 4326
CRS_FOR_BUFFERS = 6933

# hypotheses
BUFFER_SIZE_FOR_PROTECTED_BUILDINGS = 500  # meters

# epsilon for simplification - the higher the more simplified
EPSILON_SIMPLIFICATION = 0.001

# departements avec arrondissement
DEP_AVEC_ARRONDISSEMENT = ["13", "69", "75"]
