from fastapi import FastAPI
import pandas as pd
import subprocess
import json

app = FastAPI()

# Chemin de l'exécutable SAM
SAM_EXECUTABLE_PATH = "/path/to/SAM/executable"  # Modifier selon ton installation
SAM_INPUT_FILE = "../notebooks/ouput.csv"  # Chemin du fichier d'entrée CSV pour SAM
SAM_OUTPUT_FILE = "/notebooks/output_file.json"  # Fichier de sortie

def run_sam_simulation(df):
    """
    Exécute une simulation SAM en utilisant un fichier CSV en entrée.
    """
    # Sauvegarde du DataFrame en fichier CSV pour SAM
    df.to_csv(SAM_INPUT_FILE, index=False)

    # Exécute SAM avec le fichier CSV en entrée
    command = [SAM_EXECUTABLE_PATH, SAM_INPUT_FILE, SAM_OUTPUT_FILE]

    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution de SAM : {e}")
        return None

    # Lecture des résultats
    with open(SAM_OUTPUT_FILE, "r") as f:
        result = json.load(f)

    return result

@app.post("/calculate_solar_potential_dataframe/")
async def calculate_solar_potential_dataframe(file_path: str):
    """
    Charge un fichier CSV contenant les colonnes 'latitude', 'longitude', 'hauteur', 'surface'
    et exécute la simulation SAM.
    """
    # Charger les données du fichier CSV en DataFrame
    df = pd.read_csv(file_path)

    # Exécute SAM avec tout le DataFrame
    sam_result = run_sam_simulation(df)

    if sam_result:
        return {"results": sam_result}
    else:
        return {"error": "SAM simulation failed"}
