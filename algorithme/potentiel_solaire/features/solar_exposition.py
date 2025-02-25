import numpy as np
import rasterio.mask

from shapely import Geometry


def calculate_solar_exposition_building(
    zone_surrounding_building: Geometry,
    bd_irradiation_path: str
) -> float:
    """ Calcule le rayonnement solaire moyen dans une zone autour dun batiment

    :param zone_surrounding_building: geometrie centree sur le batiment
    :param bd_irradiation_path: chemin du fichier .tif des donnees d irradiation
    :return: rayonnement solaire moyen
    """
    # TODO : ne marche pas pour les DROM (exemple : la guadeloupe 971)
    # Ouverture de la tile avec le bon masque
    with rasterio.open(bd_irradiation_path) as img:
        map_solar_exposition, _ = rasterio.mask.mask(img,[zone_surrounding_building], crop=True)
        map_solar_exposition[np.isnan(map_solar_exposition)] = 0
        mean_solar_exposition = np.mean(map_solar_exposition[map_solar_exposition > 100])

    # On retourne l'irradiation moyenne
    return mean_solar_exposition
