import geopandas as gpd

from shapely.geometry import Point

from potentiel_solaire.features.pvgis_api import get_potentiel_solaire_from_closest_building
from potentiel_solaire.logger import get_logger
from potentiel_solaire.constants import (
    CRS_FOR_BUFFERS
)

logger = get_logger()


def calculate_solar_potential(
    schools_buildings: gpd.GeoDataFrame,
    geom_of_interest: gpd.GeoDataFrame,
    crs_for_buffers: int = CRS_FOR_BUFFERS
) -> gpd.GeoDataFrame:
    """Fonction principale pour calculer le potentiel solaire.

    :param schools_buildings: les batiments rataches a une ecole
    :param geom_of_interest: geodataframe avec la geometrie d interet
    :param crs_for_buffers: crs utilise pour le calcul des buffers (en metres)
    :return: le geodataframe des batiments scolaires avec les features de potentiel solaire et le
    productible annuel estimé par l'API PVGIS.
    """
    # Calcul de la surface totale au sol
    crs_init = schools_buildings.crs
    schools_buildings = schools_buildings.to_crs(epsg=crs_for_buffers)
    schools_buildings["surface_totale_au_sol"] = schools_buildings.area
    schools_buildings = schools_buildings.to_crs(crs_init)

    # Calcul de la surface de toit utile
    schools_buildings["surface_utile"] = schools_buildings.apply(
       lambda building: calculate_surface_utile(
           surface_totale_au_sol=building["surface_totale_au_sol"]
       ), axis=1
    )
    
    # Calcul de la capacité installé
    schools_buildings["peakpower"] = schools_buildings.apply(
        lambda building: calculate_installed_capacity(
            rooftop_surface=building["surface_utile"]
        ), axis=1
    )

    # On prend comme longitude et latitude du batiment le plus proche du centre de la geometrie d interet
    center = Point(geom_of_interest.centroid.x, geom_of_interest.centroid.y)
    schools_buildings["distance_to_center"] = schools_buildings.geometry.distance(center)

    # On calcul le potentiel solaire pour 1kW de puissance installee via l'API PVGIS
    potentiel_solaire_unitaire = get_potentiel_solaire_from_closest_building(
        schools_with_distance=schools_buildings,
        peakpower=1
    )

    # On le multiplie par le peakpower de chaque batiment
    schools_buildings["potentiel_solaire"] = potentiel_solaire_unitaire * schools_buildings["peakpower"]

    return schools_buildings


def calculate_surface_utile(surface_totale_au_sol: float):
    """Calcule la surface utile pour le PV.

    Nous faisons l'hypothèse qu au maximum 60 % de la surface au sol dun bâtiment 
    peut être utilisée pour installer des panneaux solaires.
    Ce coefficient tient compte, de façon simplifiée et moyennée,
    des éléments qui réduisent la surface exploitable maximum : 
     - segments de toits présentant une irradiation annuelle trop faible (liée à leur pente et orientation)
     - obstacles, équipements techniques, etc.

     Cette estimation a fait l objet d une validation sur un echantillon de 7 % des etablissements :
     - Ces etablissements ont ete selectionnes car susceptibles de faire l objet des actions prioritaires de Greenpeace France
     - Une segmentation fine des toitures a été réalisée à partir des données de Modèle Numérique de Surface (MNS)
            - cf algorithme/notebooks/calcul_segmentation_toits_etablissements_prioritaires.ipynb
     - Le potentiel solaire a été calculé en utilisant l API PVGIS en prenant en compte pente et orientation de chaque segment
            - cf algorithme/notebooks/calcul_potentiel_solaire_etablissements_prioritaires.ipynb
     - Seuls les segments présentant une irradiation annuelle supérieure à 900 kWh/m² ont été retenus 
       pour calculer la surface exploitable maximum et le potentiel total du bâtiment.

    Des analyses ont ensuite ete menées pour comparer les resultats obtenus :
    - cf algorithme/notebooks/comparaison_resultats_algorithmes.ipynb
    - cf algorithme/notebooks/Test_hypotheses_potentiel_solaire.ipynb

    :param surface_totale_au_sol: surface totale au sol du batiment
    :return: la surface utile pour installation de panneaux PV
    """
    # A minima 2 m² pour installer des panneaux
    if surface_totale_au_sol <= 4:
        return 0

    return 0.6 * surface_totale_au_sol


def calculate_installed_capacity(rooftop_surface: float) -> float:
    """
    Transform useable surface into installed capacity (peakpower), with assumption that a 
    typical PV panel produces 225W/m2, as per some modules here https://www.csisolar.com/module/.
    """
    return rooftop_surface * 225 / 1_000  # in kW
