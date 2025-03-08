"""
File containing the pipeline methodo to call the PVGIS API and add relevant solar system 
assumptions.
https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en
"""

import random
from time import sleep
import geopandas as gpd
import json
import requests

from potentiel_solaire.constants import CRS_FOR_BUFFERS, USEABLE_SURFACE


PVGIS_BASE_URL = "https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?&"


DEFAULT_QUERY_PARAMS = {
    'loss': 20, # The system's losses in percentage. Recommend between 15 - 30 %
    'fixed': 1,  # Fixed versus solar tracking system. Fixed in case of solar rooftop.
    'mountingplace': 'building', # Param should impacts losses. We may be double counting.
    
}

BUILDING_QUERY_PARAMS = [
    'lat', 
    'lon',
    'angle',
    'aspect', # azimuth
    'peakpower'
]

def prepare_df_for_pvgis_call(df: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Method used to extract, transform and add relevant fields required for the 
    PV GIS API call. Notably:
    - Latitude & longitude of building center in deg decimal
    - Roof tilt angle in deg
    - Roof orientation (aspect) in deg
    - Useable roof area in m2
    - Installed capacity (peakpower) in kW
    """
    df['lon'] = df.centroid.map(lambda p: p.x)
    df['lat'] = df.centroid.map(lambda p: p.y)
    df = df.to_crs(epsg=CRS_FOR_BUFFERS)
    
    # TODO: Currently makeshift values
    df['angle']  = df['lat'].map(lambda x: random.randint(0, 90))
    df['aspect'] = df['lat'].map(lambda x: random.randint(0, 360)) # azimuth
    df = apply_system_assumptions(df)
    df = apply_constraints(df)
    return df


def apply_system_assumptions(df: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Method aggregating all PV estimation assumptions prior to calculation / call to PVGIS API.
    Notably:
    - Reduce available surface to account for other installations, space between panels, etc.
    - Transform useable surface into installed capacity (peakpower), with assumption that a 
    typical PV panel produces 225W/m2, as per some modules here https://www.csisolar.com/module/.
    """
    df['useable_surface'] = df.area.map(lambda x: x * USEABLE_SURFACE)
    df['peakpower'] = df['useable_surface'].map(lambda x: x * 225 / 1_000) # in kW
    return df
    
    
def apply_constraints(df: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Method regrouping all methodological constraints, notably:
    - Exclude roofs badly exposed (from North-West (180) to North-East (360))
    - Exclude roofs with too big slope
    - Exclude roofs that are too small (less than 10m2)
    """
    df = df[df['aspect'] < 180]
    df = df[df['angle'] < 60]
    df = df[df['useable_surface'] > 10]
    return df



def call_pvgis_api(df: gpd.GeoDataFrame) -> dict:
    """
    Method used to build api url and calls the PVGIS API.
    TODO: Limiting requests to 3 during PoC. To remove when wanting to run through entire pipeline.
    NOTE: Added sleep timer to ensure that we do not exceed the 30 calls / second rate limit.
    """
    counter = 0
    for idx, building in df.iterrows():
        url = build_query_params_url(building[BUILDING_QUERY_PARAMS])
        df.loc[idx, 'url'] = url
        if counter < 3 :
            if response := requests.get(url):
                row_json = json.loads(response.text)
                df.loc[idx, 'annual_prod (kWh/y)'] = row_json['outputs']['totals']['fixed']['E_y']
                counter += 1
                sleep(0.03)
    return df


def build_query_params_url(params: gpd.GeoSeries) -> str:
    """
    Helper function building the PV GIS API query url with all requested params
    """
    url=f'{PVGIS_BASE_URL}&'
    url= PVGIS_BASE_URL + "&".join([f'{key}={value}' for key, value 
                                    in DEFAULT_QUERY_PARAMS.items()]) + '&'
    url+= "&".join([f'{idx}={params[idx]}' for idx in params.index])
    return url + '&outputformat=json'
