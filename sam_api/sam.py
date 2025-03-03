import pandas as pd
import PySAM.Pvwattsv8 as pvwatts
import os

# Charger le CSV
df = pd.read_csv('/Users/sarahlenet/Desktop/potentiel_solaire/13_potentiel_solaire/algorithme/notebooks/output.csv')

print(df.columns)

results = []

# Fichier météo générique à utiliser pour tous (à adapter)
solar_resource_file = "/Users/sarahlenet/Desktop/potentiel_solaire/13_potentiel_solaire/sam_api/meteo.csv"

for _, row in df.iterrows():
    # Créer une instance du modèle PVWatts
    pv = pvwatts.new()

    # Paramètres de la ressource solaire
    pv.SolarResource.solar_resource_file = solar_resource_file

    # Paramètres système
    surface_m2 = row['surfaces']
    pv.SystemDesign.system_capacity = surface_m2 * 0.2  # Exemple : 200W/m², à affiner #TODO: modify
    pv.SystemDesign.array_type = 1  # Fixe, toiture
    pv.SystemDesign.tilt = 20       # Inclinaison (à personnaliser selon le site)
    pv.SystemDesign.azimuth = 180   # Orientation sud
    pv.SystemDesign.losses = 14     # Pertes globales (%)

    # Exécuter la simulation
    pv.execute()

    # Stocker le résultat
    results.append({
        'name': row['cleabs_bat'],
        'annual_energy_kwh': pv.Outputs.ac_annual
    })

# Sauvegarde des résultats
pd.DataFrame(results).to_csv('solar_potential_results.csv', index=False)
