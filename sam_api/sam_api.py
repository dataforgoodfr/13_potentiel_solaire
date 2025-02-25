from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import subprocess
import os
import json
from shapely.geometry import Polygon
import geopandas as gpd

app = FastAPI()

# Assuming you have SAM installed and the `SAM_EXECUTABLE_PATH` is set
SAM_EXECUTABLE_PATH = "/path/to/SAM/executable"  # Path to SAM executable or script

class Roof(BaseModel):
    name: str
    # Expecting polygon coordinates (latitude, longitude) for the roof's vertices
    coordinates: List[List[float]]  # [[latitude1, longitude1], [latitude2, longitude2], ...]
    elevation: float  # Elevation of the roof

class SolarRequest(BaseModel):
    roofs: List[Roof]

def run_sam_simulation(lat, lon, elevation, system_size, tilt_angle, azimuth_angle):
    """
    This function runs a SAM simulation with the provided parameters.
    The system should be set up to run SAM command-line simulations.
    """
    # Here, we're assuming you have a SAM simulation file and parameters that you can pass to SAM
    sam_input_file = "/path/to/sam/input_file.sdf"
    sam_output_file = "/path/to/sam/output_file.json"

    # Prepare input data for SAM (you'll need to replace this with actual input logic for SAM)
    sam_data = {
        "latitude": lat,
        "longitude": lon,
        "elevation": elevation,
        "system_size": system_size,
        "tilt_angle": tilt_angle,
        "azimuth_angle": azimuth_angle
    }

    # Write the input data to a file or set environment variables if needed
    with open(sam_input_file, "w") as f:
        json.dump(sam_data, f)
    
    # Run SAM executable (this could be a script that launches SAM simulation)
    command = [SAM_EXECUTABLE_PATH, sam_input_file, sam_output_file]
    
    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running SAM simulation: {e}")
        return None

    # Read the output file (this will depend on SAM's output format)
    with open(sam_output_file, "r") as f:
        result = json.load(f)

    return result

@app.post("/calculate_solar_potential_batch/")
async def calculate_solar_potential_batch(request: SolarRequest):
    results = []
    
    for roof in request.roofs:
        # Convert the list of coordinates to a Polygon (using GeoPandas)
        polygon = Polygon(roof.coordinates)
        
        # Example: Calculate roof area in square meters (this requires a CRS for accurate calculation)
        gdf = gpd.GeoDataFrame({"geometry": [polygon]}, crs="EPSG:4326")
        gdf = gdf.to_crs(epsg=3395)  # Convert to meters (Web Mercator)
        area = gdf.geometry.area[0]  # Area in square meters
        
        # Example parameters for SAM simulation
        system_size = area * 0.1  # 10% of roof area for system size (example)
        tilt_angle = 30  # Example tilt angle
        azimuth_angle = 180  # Example azimuth angle (South-facing)

        # Run the SAM simulation
        sam_result = run_sam_simulation(
            lat=roof.coordinates[0][0], 
            lon=roof.coordinates[0][1], 
            elevation=roof.elevation, 
            system_size=system_size,
            tilt_angle=tilt_angle,
            azimuth_angle=azimuth_angle
        )

        if sam_result:
            results.append({
                "roof_name": roof.name,
                "solar_potential": sam_result.get("annual_energy", "N/A"),  # Modify based on SAM output
                "roof_area": area,
                "elevation": roof.elevation
            })
        else:
            results.append({
                "roof_name": roof.name,
                "error": "SAM simulation failed"
            })

    return {"results": results}
