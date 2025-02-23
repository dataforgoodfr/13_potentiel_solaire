import geopandas as gpd
from shapely.affinity import translate
from shapely.ops import unary_union
from shapely import intersection
import numpy as np
import ephem
from datetime import datetime
import math


def get_sun_position(latitude, longitude, date, hour):
    """
    Calculate sun's position (altitude and azimuth) for given coordinates,
    date and hour

    Args:
        latitude (float): Latitude in degrees (-90 to 90)
        longitude (float): Longitude in degrees (-180 to 180)
        date (str): Date in format 'YYYY-MM-DD'
        hour (int): Hour of the day (0-23)

    Returns:
        tuple: (altitude in degrees, azimuth in degrees)
    """
    # Create observer object
    observer = ephem.Observer()
    observer.lat = str(latitude)
    observer.lon = str(longitude)

    # Parse the date string and set the specified hour
    specified_date = datetime.strptime(date, '%Y-%m-%d')
    specified_date = specified_date.replace(hour=hour, minute=0, second=0)
    observer.date = specified_date

    # Calculate sun's position
    sun = ephem.Sun()
    sun.compute(observer)

    # Convert altitude and azimuth to degrees
    altitude = math.degrees(sun.alt)
    azimuth = math.degrees(sun.az)

    return altitude, azimuth


def getBatimentsEcoles(ID, ecoles, batiments, col_id="cleabs_left"):
    # @TODO: Docstring à écrire
    ecole_cible = ecoles[ecoles[col_id] == ID]
    zone = ecole_cible["geometry"].iloc[0]
    batiments_ecole = batiments[batiments.within(zone)]
    hauteur_moyenne = batiments_ecole['hauteur'].mean()
    batiments_ecole.fillna(value=hauteur_moyenne, inplace=True)
    return batiments_ecole, ecole_cible, zone


def getBatiments(ID, ecoles, batiments, rayon=100):
    # @TODO: Docstring à écrire
    zone = ecoles[ecoles.cleabs_left == ID]["geometry"].iloc[0]
    batiments_ecole = batiments[batiments.within(zone)]
    hauteur_moyenne = batiments_ecole['hauteur'].mean()
    if hauteur_moyenne > 0:
        batiments_ecole.fillna(value=hauteur_moyenne, inplace=True)
    else:
        raise KeyError("None")
    hauteur_min = batiments_ecole['hauteur'].min()
    batiments["distance"] = batiments.geometry.distance(zone)
    batiments_voisins = batiments[batiments["distance"] < rayon].copy()
    batiments_voisins = batiments[batiments.within(zone.buffer(rayon))]
    hauteur_moyenne_voisins = batiments_voisins['hauteur'].mean()
    batiments_ecole.fillna(value=hauteur_moyenne_voisins, inplace=True)
    return batiments_voisins[batiments_voisins["hauteur"] > hauteur_min]


def getOmbreUnitaire(ombres_potentielles, h, i, shape_batiment, resolution=10):
    # @TODO: Docstring à écrire
    saisons = {
        "hiver": "2024-12-21",       # Soleil bas en hiver (21 décembre)
        "printemps": "2024-03-21",   # Équinoxe (21 mars)
        "été": "2024-06-21",         # Soleil haut en été (21 juin)
        "automne": "2024-09-21"      # Équinoxe (21 septembre)
    }

    jours_cles = list(saisons.keys())

    # Heures à considérer
    heures = [10, 12, 14, 16]
    # @TODO à tweaker
    POS = [43, 2]

    ombre_totale = []
    for _, saison in enumerate(jours_cles):
        for heure in heures:
            X, Y = get_sun_position(POS[0], POS[1], saisons[saison], heure)
            X = np.radians(X)
            Y = np.radians(Y-180)
            for _, row in ombres_potentielles.iterrows():
                hauteur_relative = row["hauteur"] - h
                distance_ombre = hauteur_relative / np.tan(X)
                deplacement_x = distance_ombre * np.sin(Y)
                deplacement_y = distance_ombre * np.cos(Y)
                OP = []  # Ombre projectée
                for r in range(resolution+1):
                    OP.append(translate(row["geometry"],
                                        xoff=r*deplacement_x/resolution,
                                        yoff=r*deplacement_y/resolution))
                OP = unary_union(OP)
                # ombre_projetee shape_batiment
                ombrage = intersection(OP, shape_batiment)
                ombre_totale.append(ombrage)
    ombre_totale = unary_union(ombre_totale)
    return ombre_totale


def getOmbre(batiments_ecole, batiments_hauts, col_id="cleabs_left__bat"):
    ombres = []
    for _, row in batiments_ecole.iterrows():
        h = row["hauteur"]
        i = row[col_id]
        shape_batiment = row["geometry"]
        ombres_potentielles = batiments_hauts[(batiments_hauts.hauteur > h)]
        ombres_potentielles_shapes = getOmbreUnitaire(ombres_potentielles, h,
                                                      i, shape_batiment,
                                                      resolution=10)
        if not ombres_potentielles_shapes.is_empty:
            ombres.append(ombres_potentielles_shapes)
    ombres = unary_union(ombres)
    ombres = gpd.GeoDataFrame(geometry=[ombres], crs=2154)
    ombres["geometries"] = ombres.apply(lambda x:
                                        [g for g in x.geometry.geoms], axis=1)
    ombres = ombres.explode(column="geometries").drop(columns="geometry").\
        set_geometry("geometries").rename_geometry("geometry").\
        reset_index(drop=True)
    return ombres

