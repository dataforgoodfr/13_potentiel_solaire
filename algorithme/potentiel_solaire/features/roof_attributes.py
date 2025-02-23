import os
import geopandas as gpd
from owslib.wms import WebMapService
from rasterio import MemoryFile
import rasterio.mask
from potentiel_solaire.constants import DATA_FOLDER
import numpy as np
import pandas as pd
# TODO


def getRaster(boite, layer, srs, X, Y):
    url = "https://data.geopf.fr/wms-r/wms?SERVICE=WMS"
    wms = WebMapService(url, version='1.3.0')

    img_mns = wms.getmap(layers=[layer],
                         srs=srs, bbox=boite, size=(X, Y),
                         format='image/geotiff')
    return img_mns


def rasterMNH(row):

    boite = row.total_bounds
    X = int((boite[2]-boite[0])*2)
    Y = int((boite[3]-boite[1])*2)

    img_mns = getRaster(boite, "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES.MNS",
                        srs='EPSG:2154', X=X, Y=Y)
    with MemoryFile(img_mns) as memfile:
        with memfile.open() as dataset:
            mns, _ = rasterio.mask.mask(dataset, row.geometry, crop=True)

    img_mnt = getRaster(boite, "ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES",
                        srs='EPSG:2154', X=X, Y=Y)
    with MemoryFile(img_mnt) as memfile:
        with memfile.open() as dataset:
            mnt, _ = rasterio.mask.mask(dataset, row.geometry, crop=True)
    mnh = mns - mnt
    return mnh


def getMesureMNSToit(row, cache_file="cache.gpkg", layercache="cache_hauteur",
                     valeur="hauteur_calculee"):

    values = ["hauteur_calculee", "hauteur_std-dev", "hauteur_min",
              "hauteur_max", "hauteur_median"]
    if valeur not in values:
        return -1
    row = gpd.GeoDataFrame(row).T
    row = gpd.GeoDataFrame(row, geometry="geometry")
    if "cleabs_left__bat" in row.columns:
        row = row.rename(columns={"cleabs_left__bat": "cleabs"})
    cache_h = DATA_FOLDER / cache_file

    if os.path.isfile(str(cache_h)):
        gdf = gpd.read_file(cache_h, layer=layercache)
        existing = gdf["cleabs"].unique()
    else:
        existing = []
    row = row[["cleabs", "hauteur", "geometry"]]

    cols = ["cleabs", "hauteur_calculee", "hauteur", "geometry",
            "hauteur_std-dev", "hauteur_min", "hauteur_max", "hauteur_median"]

    if row["cleabs"].iloc[0] in existing:
        v = gdf[gdf.cleabs == row["cleabs"].iloc[0]][valeur].iloc[0]
        return v
    else:
        mnh = rasterMNH(row)
        row["hauteur_calculee"] = np.average(mnh[np.nonzero(mnh)])
        row["hauteur_std-dev"] = np.std(mnh[np.nonzero(mnh)])
        row["hauteur_min"] = np.min(mnh[np.nonzero(mnh)])
        row["hauteur_max"] = np.max(mnh[np.nonzero(mnh)])
        row["hauteur_median"] = np.median(mnh[np.nonzero(mnh)])

        if len(existing):
            gtotal = pd.concat([gdf, row[cols]])
            gtotal.to_file(cache_h, layer=layercache, driver="GPKG")
        else:
            gtotal = row[cols]
            gtotal.to_file(cache_h, layer=layercache, driver="GPKG")

    return row[valeur]

def calculate_surface_utile(surface_totale_au_sol: float):
    """Calcule la surface utile pour le PV.

    Pour le moment il s agit d'un simple ratio.
    @TODO Remplacer par une formule plus fine

    :param surface_totale_au_sol: surface totale au sol du batiment
    :return: la surface utile pour installation de panneaux PV
    """
    if surface_totale_au_sol <= 100:
        return 0

    if 100 < surface_totale_au_sol < 500:
        ratio = 0.4 * surface_totale_au_sol / 5000 + 0.2
        return ratio * surface_totale_au_sol

    return 0.6 * surface_totale_au_sol
