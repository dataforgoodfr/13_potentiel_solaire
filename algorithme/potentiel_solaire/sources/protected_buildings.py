import geopandas as gpd
from potentiel_solaire.constants import DEFAULT_CRS, BUFFER_SIZE_FOR_PROTECTED_BUILDINGS, CRS_FOR_BUFFERS
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_areas_with_protected_buildings(
    bd_protected_buildings_path: str,
    geom_of_interest: gpd.GeoDataFrame,
    buffer_size_for_protected_buildings: float = BUFFER_SIZE_FOR_PROTECTED_BUILDINGS,
    crs: int = DEFAULT_CRS,
    crs_for_buffers: int = CRS_FOR_BUFFERS
):
    """Filtre et renvoit les batiments proteges sur la zone d'interet

    :param bd_protected_buildings_path: chemin du fichier .geojson des batiments proteges
    :param geom_of_interest: geodataframe avec la geometrie d interet
    :param buffer_size_for_protected_buildings: taille du buffer autour des batiments proteges
    :param crs: projection de la gdf renvoyee
    :param crs_for_buffers: crs utilise pour le calcul des buffers (en metres)
    :return: gdf des zones avec des batiments proteges
    """
    # Aggrandissement de la zone d interet pour eviter les effets de bords
    geom_of_interest_buffered = geom_of_interest.to_crs(
        crs_for_buffers
    ).buffer(buffer_size_for_protected_buildings)

    # Lecture de la bdd des batiments proteges sur la zone dinteret bufferizee
    columns = [
        "reference",
        "departement_format_numerique",
        "geometry"
    ]
    protected_buildings = gpd.read_file(
        bd_protected_buildings_path, mask=geom_of_interest_buffered
    )[columns].to_crs(crs_for_buffers)

    # On cree un buffer autour de chaque batiment protege
    areas_with_protected_buildings = protected_buildings.buffer(
        buffer_size_for_protected_buildings,
        cap_style="round"
    )

    return areas_with_protected_buildings.to_crs(crs)
