import numpy as np
import rasterio.mask
from potentiel_solaire.constants import DATA_FOLDER


def getIrradiationEcole(batiment):
    # Définition des sources
    tileIrradiation = "/ENR_1-0_IRR-SOL_TIFF_WGS84G_FXX_2023-10-01/1_DONNEES_LIVRAISON/GlobalHorizontalIrradiation.tif"
    path = str(DATA_FOLDER) + "/"+tileIrradiation
    # On créé une zone buffer autour des batiments
    geo = batiment.to_crs(epsg=6933).buffer(2000)  # buffer de 2km
    batiment["geometry"] = geo
    batiment = batiment.to_crs(epsg=4326)
    # Ouverture de la tile avec le bon masque
    irrs = []
    with rasterio.open(path) as img:
        for _, row in batiment.iterrows():
            mapIrradiation, _ = rasterio.mask.mask(img, \
                                                   [row.geometry], crop=True)
            mapIrradiation[np.isnan(mapIrradiation)] = 0
            irr = np.mean(mapIrradiation[mapIrradiation > 100])
            irrs.append(irr)
    # On retourne l'irradiation moyenne
    batiment["rayonnement_solaire"] = irrs
    return batiment
