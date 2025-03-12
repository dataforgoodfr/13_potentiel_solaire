# TODO
from owslib.wms import WebMapService
import rasterio.mask
import geopandas as gpd
import os
import hashlib
from shapely import wkt
from rasterio import MemoryFile

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


