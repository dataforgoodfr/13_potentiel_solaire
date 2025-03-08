import os
import re

import requests
from bs4 import BeautifulSoup
import geopandas as gpd
import pandas as pd

from potentiel_solaire.constants import DATA_FOLDER, DEFAULT_CRS
from potentiel_solaire.sources.utils import download_file, extract_7z, find_matching_files
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_urls_for_bd_pci_shp(
    bd_pci_page="https://geoservices.ign.fr/parcellaire-express-pci",
    date="2025-01-01"
):
    """Récupère les urls disponibles pour les données de la BD PCI en format .shp pour tous les départements

    :param bd_pci_page: url de la page de télechargement de la BD PCI
    :param date: date de référence pour les données
    :return: liste des urls
    """
    response = requests.get(bd_pci_page)
    soup = BeautifulSoup(response.text, "html.parser")

    href_elements = [element.get("href") for element in soup.find_all("a") if element.get("href")]

    shp_regex = rf"https?://.*PARCELLAIRE.*SHP_.*_D[A-Za-z0-9]{{3}}_{date}.*\.7z"

    return [href_element for href_element in href_elements if re.search(shp_regex, href_element)]


def get_url_for_bd_pci_shp_for_departement(
    code_departement: str
):
    """Récupère l'url de télechargement des fichiers de la BD PCI en format .shp pour le département donné

    :param code_departement: code du département
    :return: url
    """
    shp_urls = get_urls_for_bd_pci_shp()
    logger.info("%s urls available for BD PCI data per departement with shp format", len(shp_urls))

    url = [url for url in shp_urls if re.search(rf"{code_departement}", url)][0]
    logger.info("L'url du departement %s est %s", code_departement, url)

    return url


def find_shp_file_bd_pci(
    code_departement: str,
    data_directory: str = DATA_FOLDER,
):
    """Récupère le chemin du fichier .shp pour un département donné

    :param code_departement: code du département
    :param data_directory: dossier où sont sauvegardés les fichiers
    :return: chemin du fichier .shp avec les données
    """
    files = find_matching_files(
        folder_path=data_directory,
        filename_pattern=r"BATIMENT.SHP",
        folder_pattern=rf"PEPCI.*D{code_departement}"
    )

    assert len(files) < 2, f"Plus d'un fichier .shp trouvé pour le département {code_departement}"

    return files[0] if len(files) > 0 else None


def extract_bd_pci(
    code_departement: str,
    output_directory: str = DATA_FOLDER,
):
    """Extrait les fichiers de la BD PCI pour un département

    :param code_departement: code du département
    :param output_directory: dossier où sauvegarder les fichiers
    :return: chemin du fichier .shp avec les données
    """
    # check if already extracted
    shp_filepath = find_shp_file_bd_pci(
        code_departement=code_departement,
        data_directory=output_directory
    )
    if shp_filepath is not None:
        logger.info("Fichier .shp %s pour le departement %s déjà téléchargé",
                    shp_filepath, code_departement)
        return shp_filepath

    # get url for download
    url_departement = get_url_for_bd_pci_shp_for_departement(code_departement=code_departement)
    # download zip file
    output_filename = url_departement.split('/')[-1]
    output_7z_filepath = os.path.join(output_directory, output_filename)
    download_file(url=url_departement, output_filepath=output_7z_filepath)

    # extract zip file
    extract_7z(input_filepath=output_7z_filepath, output_folder=output_directory)

    # delete zip file
    os.remove(output_7z_filepath)

    return find_shp_file_bd_pci(
        code_departement=code_departement,
        data_directory=output_directory
    )


def get_pci_buildings_of_interest(
    bd_pci_path: str,
    geom_of_interest: gpd.GeoDataFrame,
    crs: int = DEFAULT_CRS
) -> gpd.GeoDataFrame:
    """Filtre et renvoit les bâtiments de la BD PCI

    :param bd_pci_path: chemin du fichier .SHP de la BD PCI
    :param geom_of_interest: geodataframe avec la géometrie d'intêret
    :param crs: projection de la gdf renvoyée
    :return: geodataframe avec les bâtiments filtrés
    """

    buildings = gpd.read_file(
        bd_pci_path,
        mask=geom_of_interest,
    )   

    return gpd.GeoDataFrame(
        geometry=buildings['geometry'],
        crs=buildings.crs
    ).to_crs(crs)


def supplement_topo_with_unique_pci_buildings(
    topo_buildings: gpd.GeoDataFrame,
    pci_buildings: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """Permet de compléter la bd topo avec les bâtiments qui de la bd PCI qui n'etait pas dans la bd topo.
    
    :param topo_buildings: GeoDataFrame des bâtiments de la bd topo
    :param pci_buildings: GeoDataFrame des bâtiments de la bd PCI
    :return: GeoDataFrame des bâtiments de la bd topo complétés avec les bâtiments de la bd PCI
    """

    topo_sindex = topo_buildings.sindex
    
    new_buildings = []
    for idx, pci_building in pci_buildings.iterrows():
        possible_matches = list(topo_sindex.intersection(pci_building.geometry.bounds))
        
        if not possible_matches:
            # no overlap - this is a new building
            new_building = {
                'geometry': pci_building.geometry,
                'cleabs': f'PCI_{idx}',  
                'construction_legere': False,  
                'hauteur': None,
                'source': 'PCI'  
            }
            new_buildings.append(new_building)
            continue
            
        # check overlap > threshold 
        is_new = True
        for match_idx in possible_matches:
            topo_geom = topo_buildings.iloc[match_idx].geometry
            if pci_building.geometry.intersects(topo_geom):
                # Calculate overlap ratio
                intersection_area = pci_building.geometry.intersection(topo_geom).area
                min_area = min(pci_building.geometry.area, topo_geom.area)
                overlap_ratio = intersection_area / min_area
                
                if overlap_ratio > 0.1:  # buildings overlap by more than 10%
                    is_new = False
                    break
        
        if is_new:
            new_building = {
                'geometry': pci_building.geometry,
                'cleabs': f'PCI_{idx}',
                'construction_legere': False,
                'hauteur': None,
                'source': 'PCI'
            }
            new_buildings.append(new_building)
    
    if new_buildings:
        new_buildings_gdf = gpd.GeoDataFrame(new_buildings, crs=topo_buildings.crs)
        
        # add source to original TOPO buildings
        topo_buildings = topo_buildings.copy()
        topo_buildings['source'] = 'TOPO'
        
        final_buildings = pd.concat([topo_buildings, new_buildings_gdf], ignore_index=True)
    else:
        final_buildings = topo_buildings.copy()
        final_buildings['source'] = 'TOPO'
    
    logger.info(f"TOPO buildings: {len(topo_buildings)}")
    logger.info(f"PCI buildings ajoutés: {len(new_buildings)}")
    logger.info(f"Nombre totaux de buildings: {len(final_buildings)}")
    
    return final_buildings
