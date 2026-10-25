from pathlib import Path


# Paths
ALGORITHME_FOLDER = Path(__file__).parent.parent
DATA_FOLDER = ALGORITHME_FOLDER / 'data'
DATABASE_FOLDER = ALGORITHME_FOLDER / 'database'
RESULTS_FOLDER = DATA_FOLDER / 'results'
SOURCES_FILEPATH = ALGORITHME_FOLDER / "sources.yaml"
DUCK_DB_PATH = DATABASE_FOLDER / 'potentiel_solaire.duckdb'

# Create data directories
DATA_FOLDER.mkdir(parents=True, exist_ok=True)
RESULTS_FOLDER.mkdir(parents=True, exist_ok=True)

# IGN Geoplateforme (API de telechargement)
GEOPF_BASE_URL = "https://data.geopf.fr/telechargement"

# BD TOPO
BD_TOPO_RESOURCE_ID = "BDTOPO"
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
