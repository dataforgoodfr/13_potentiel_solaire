from pathlib import Path


ALGORITHME_FOLDER = Path(__file__).parent.parent
DATA_FOLDER = ALGORITHME_FOLDER / 'data'
SCHOOLS_ESTABLISHMENTS_FILENAME = "fr-en-annuaire-education.geojson"
CONTOURS_DEPARTEMENTS_FILENAME = "contour-des-departements.geojson"
CRS = 4326
CRS_LAMBERT = 2154

# hypothese
RENDEMENT_PANNEAU_PV = 0.1
