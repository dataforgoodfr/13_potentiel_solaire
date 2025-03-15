# TODO
from owslib.wms import WebMapService
import rasterio.mask
import geopandas as gpd
import os
import hashlib
from shapely import wkt
from rasterio import MemoryFile
import numpy as np
import pandas as pd
from scipy.ndimage import sobel, label


from potentiel_solaire.constants import DATA_FOLDER


def recuperation_flux_wms(
        bbox: list[int],
        layer: str,
        srs: str,
        width: int,
        height: int
):
    """
    Retrieve geospatial data from a WMS service as a GeoTIFF image.

    This function connects to the French national geographic institute's (IGN)
    WMS server and retrieves raster data for the specified layer and bounding
    box.

    Parameters
    ----------
    bbox : tuple or list
        Bounding box coordinates in the format (xmin, ymin, xmax, ymax)
        defining the area of interest.
    layer : str
        The WMS layer name to request (e.g.,
        "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES").
    srs : str
        Spatial reference system identifier (e.g., 'EPSG:2154') for the
        coordinate system of the input bounding box and output data.
    width : int
        Width of the requested image in pixels.
    height : int
        Height of the requested image in pixels.

    Returns
    -------
    bytes
        The raw GeoTIFF image data as a bytes object, which can be processed
        further using libraries like rasterio or saved to a file.

    Notes
    -----
    - Uses the OWSLib WebMapService client to connect to the IGN WMS server
    - Requests data in GeoTIFF format for preserving geospatial information
    - The server URL is hardcoded to the French Géoportail WMS endpoint
    - Uses WMS version 1.3.0 for the request
    """

    # url = "https://data.geopf.fr/wms-r"
    # Originally "https://data.geopf.fr/wms-r/wms?SERVICE=WMS"
    # but failed with a 'content-type' error. Then tested below which worked
    url = "https://data.geopf.fr/annexes/ressources/wms-r/essentiels.xml"
    wms = WebMapService(url, version='1.3.0')

    img_mns = wms.getmap(
        layers=[layer],
        srs=srs,
        bbox=bbox,
        size=(width, height),
        format='image/geotiff'
    )
    return img_mns


def recuperation_mnx(
        zone_of_interest: gpd.GeoDataFrame,
        srs: str,
        layer: str,
        cache: bool = False
):
    """
    Retrieve elevation raster data (MNS or MNT) for a specific building
    footprint.

    This function calculates the bounding box of the input geometry,
    retrieves the corresponding elevation data via WMS, and then masks
    the raster to the exact building geometry.

    Parameters
    ----------
    zone_of_interest : geopandas.GeoSeries or similar
        A row containing building geometry information with 'geometry'
        attribute and 'total_bounds' method to retrieve the bounding box.
    srs : str
        Spatial reference system identifier (e.g., 'EPSG:2154') for the
        coordinate system to use in the WMS request.
    layer : str
        WMS layer name to request (e.g.,
        "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES.MNS"
        for MNS or "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES" for MNT).
    cache : bool
        to cache or not results locally

    Returns
    -------
    numpy.ndarray
        Masked elevation raster data corresponding to the building geometry.

    Notes
    -----
    - Uses the recuperation_flux_wms function to retrieve the elevation data
    - Uses rasterio.mask to clip the raster to the building geometry
    - The MemoryFile class is used to handle the raster data in memory
    - Cached:   takes 23.9 ms ± 1.9 ms per loop
    - Uncached: takes 1.66 s  ± 138 ms per loop
    """
    bbox = zone_of_interest.total_bounds
    wigth = int((bbox[2] - bbox[0]) * 2)
    height = int((bbox[3] - bbox[1]) * 2)

    if zone_of_interest.crs != srs:
        raise ValueError(
            "The zone of interest is of crs {} and for layer {} only crs {} is supported".format(
                zone_of_interest.crs, layer, srs
            ))

    if not cache:
        flux = recuperation_flux_wms(
            bbox=bbox, layer=layer, srs=srs, width=wigth, height=height
        )
        with MemoryFile(flux) as memfile:
            with memfile.open() as img:
                data, _ = rasterio.mask.mask(img, zone_of_interest.geometry, crop=True)
    else:
        # Creation des IDs des cache
        layer_hash = hashlib.md5(layer.encode()).hexdigest()[:8]
        wkts = wkt.dumps(zone_of_interest.geometry.iloc[0])
        wkts = hashlib.md5(wkts.encode()).hexdigest()[:8]
        filename = f'{wkts}.tiff'
        # Stores diffent layers in different folders
        path_to_wns_cache = DATA_FOLDER / "cache" / "wns" / layer_hash
        # Creates folders if not existing
        path_to_wns_cache.mkdir(parents=True, exist_ok=True)
        wns_data_path = path_to_wns_cache / filename
        # Saves files
        if not os.path.isfile(str(wns_data_path)):
            flux = recuperation_flux_wms(
                bbox=bbox, layer=layer, srs=srs, width=wigth, height=height
            )
            with open(wns_data_path, 'wb') as out:
                out.write(flux.read())
        with rasterio.open(wns_data_path) as img:
            data, _ = rasterio.mask.mask(img, zone_of_interest.geometry, crop=True)

    return data


def recuperation_mns(zone_of_interest: gpd.GeoDataFrame, cache: bool = False):
    srs_mnx = 'EPSG:2154'
    nom_couche_mns = "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES.MNS"
    return recuperation_mnx(
        zone_of_interest=zone_of_interest, srs=srs_mnx, layer=nom_couche_mns, cache=cache
    )


def recuperation_mnt(zone_of_interest: gpd.GeoDataFrame, cache: bool = False):
    srs_mnx = 'EPSG:2154'
    nom_couche_mnt = "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES"
    return recuperation_mnx(
        zone_of_interest=zone_of_interest, srs=srs_mnx, layer=nom_couche_mnt, cache=cache
    )


def recuperation_mnh(
        zone_of_interest: gpd.GeoDataFrame,
        cache: bool = False
):
    """
    Calculate the normalized height model (MNH) for a building by subtracting
    the Digital Terrain Model (MNT) from the Digital Surface Model (MNS).

    This function retrieves both the MNT and MNS data for a specific building
    represented by the input row, and calculates the difference between them to
    obtain the normalized height model, which represents the height of objects
    above ground level.

    Parameters
    ----------
    zone_of_interest : geopandas.GeoSeries
        A row with geometric information about a building, required by the
        underlying recuperation_mnx_batiment function.
    cache : bool
        to cache or not results locally

    Returns
    -------
    numpy.ndarray or similar
        The MNH for the building, calculated as
        the difference between MNS and MNT values.
    """

    mns = recuperation_mns(zone_of_interest=zone_of_interest, cache=cache)
    mnt = recuperation_mnt(zone_of_interest=zone_of_interest, cache=cache)
    return mns - mnt


def segmentation_toits(data):
    """Calcule la pente, l'azimut et la surface des segments de toits.

    Parameters
    data : numpy.ndarray
        Masked elevation raster data corresponding to the building geometry.

    Return
      Dataframe with one mine equivalent to a utile segment with a slope and an azimut.

    @To do - Add package to install

    """
    # Calculate gradients, then slopes and azimuths.
    dx = sobel(data[0], axis=0)  # Gradient selon l'axe X (est-ouest)
    dy = sobel(data[0], axis=1)  # Gradient selon l'axe Y (nord-sud)
    slope = np.arctan(np.sqrt(dx**2 + dy**2)) * (180 / np.pi)
    azimut = (360 - np.degrees(np.arctan2(dy, dx))) % 360

    # Creating bins for the slope
    bins = list(np.arange(0, slope.max(),20)) 
    values = list(np.convolve(bins, [0.5, 0.5]))
    values = values[:-1]
    indexed = np.digitize(slope, bins, right=False)  # Trouve l'index de la fourchette
    result_slope = np.array(values)[indexed - 1] 

    # Identification of flat roof and filter on azimut and slope
    flat_mask = result_slope < 15   
    slope_filtered = np.where(flat_mask, 0, slope)
    azimut_filtered = np.where(flat_mask, 0, azimut)

    # Border detection with change in azimut
    border_x = np.abs(np.diff(azimut_filtered, axis=0, prepend=azimut_filtered[0:1, :])) > 25
    border_y = np.abs(np.diff(azimut_filtered, axis=1, prepend=azimut_filtered[:, 0:1])) > 25
    regions_mask = ~(border_x | border_y)
    azimut_bounds = np.where(regions_mask,0,1)

    # Border detection with change in slope
    border_x = np.abs(np.diff(slope_filtered, axis=0, prepend=slope_filtered[0:1, :])) > 40
    border_y = np.abs(np.diff(slope_filtered, axis=1, prepend=slope_filtered[:, 0:1])) > 40
    slope_bounds = np.where(regions_mask,0,1)
    regions_mask = ~(border_x | border_y)

    # Border detection with high slope
    regions_mask = slope_filtered > 80
    high_slope_bounds = np.where(regions_mask,1,0)

    # Final bounds
    final_bounds = azimut_bounds + slope_bounds + high_slope_bounds
    final_bounds = (final_bounds > 0).astype(int) 

    # Creating clusters
    labeled_bounds, num_features = label(final_bounds == 0)
    mask = data == 0
    labeled_bounds = np.where(mask, None, labeled_bounds)

    # Final dataframe
    df_segment_toiture = pd.DataFrame({"label":[],"surface":[],"slope":[],"azimut":[]})
    
    for n in range(1,num_features+1) : 
        labeled_bounds_mask = labeled_bounds == n 
        slope_n = np.where(labeled_bounds_mask, slope_filtered, 0)
        azimut_n = np.where(labeled_bounds_mask, azimut_filtered, 0)
        surface_m = np.sum(labeled_bounds_mask) * 0.25
        slope_degree = np.sum(slope_n) / np.sum(labeled_bounds_mask)
        azimut_degree = np.sum(azimut_n) / np.sum(labeled_bounds_mask)
        new_row = pd.DataFrame({"label":[int(n)],"surface":[surface_m],"slope":[slope_degree],"azimut":[azimut_degree]})
        df_segment_toiture = pd.concat([df_segment_toiture,new_row])

    # Filter on Minimum surfact
    min_surface = 50
    final_segment_toiture = df_segment_toiture[df_segment_toiture["surface"]>min_surface].sort_values("surface")

    return final_segment_toiture
