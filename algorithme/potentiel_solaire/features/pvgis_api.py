"""
File containing the pipeline methodo to call the PVGIS API and add relevant solar system 
assumptions.
https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en
"""
from time import sleep
import geopandas as gpd
import requests

from potentiel_solaire.logger import get_logger


logger = get_logger()


PVGIS_BASE_URL = "https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?&"
DEFAULT_QUERY_PARAMS = {
    "outputformat": "json",
    "loss": 14,  # The system's losses in percentage. Recommend between 15 - 30 %
    "fixed": 1,  # Fixed versus solar tracking system. Fixed in case of solar rooftop.
    "mountingplace": 'building',  # Param should impacts losses. We may be double counting.
    "optimalangles": 1,  # Letting the engine optimise the ti
}


def get_potentiel_solaire_from_pvgis_api(
    latitude: float,
    longitude: float,
    peakpower: float,
) -> float:
    """
    Method used to build api url and calls the PVGIS API.
    
    Returns the annual energy production (kWh/yr)
    
    NOTE: Added sleep timer to ensure that we do not exceed the 30 calls / second rate limit.
    TODO: There are many more output parameters available.
    """
    if peakpower <= 0:
        return 0.0

    params = {
        "lat": latitude,
        "lon": longitude,
        "peakpower": peakpower,
        **DEFAULT_QUERY_PARAMS
    }

    response = requests.get(PVGIS_BASE_URL, params=params)
    response.raise_for_status()
    
    if response.status_code == 200:
        data = response.json()
        return data['outputs']['totals']['fixed']['E_y']

    if response.status_code == 429:
        sleep(0.04)
        return get_potentiel_solaire_from_pvgis_api(
            latitude=latitude,
            longitude=longitude,
            peakpower=peakpower
        )

    if response.status_code == 529:
        sleep(5)
        return get_potentiel_solaire_from_pvgis_api(
            latitude=latitude,
            longitude=longitude,
            peakpower=peakpower
        )

    logger.error(f'Failed to query API. Response: {response}')
    response.raise_for_status()



def get_potentiel_solaire_from_closest_building(
    schools_with_distance: gpd.GeoDataFrame,
    peakpower: float,
) -> float:
    """
    Method used to get the solar potential from the building with the minimum value for distance_to_center.
    
    Args:  
        schools_with_distance (gpd.GeoDataFrame): DataFrame containing the buildings and their distance to the center.
        peakpower (float): Peak power of the solar system.
    """

    for number_building in range(len(schools_with_distance)):
        n_closest_building = schools_with_distance.sort_values(
                by = 'distance_to_center',
                ascending = True).iloc[number_building]
            
        longitude = n_closest_building.geometry.centroid.x
        latitude = n_closest_building.geometry.centroid.y
        
        try : 
            potentiel_solaire = get_potentiel_solaire_from_pvgis_api(
                latitude=latitude,
                longitude=longitude,
                peakpower=peakpower
            )

            logger.info(f"Potentiel solaire calculé sur le batiment {n_closest_building.cleabs_bat}")

            return potentiel_solaire
        
        except requests.exceptions.HTTPError as e:
            # Cette erreur arrive quand lapi ne couvre pas la position demandee
            if e.response.status_code == 500:
                logger.warning(f'500 error encountered for building {n_closest_building.cleabs_bat}. Trying next building.')
                continue 
            raise e       
