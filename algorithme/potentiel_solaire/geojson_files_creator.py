import pandas as pd
import geopandas as gpd
import shapely.geometry
import json

from potentiel_solaire.constants import DEFAULT_CRS
from potentiel_solaire.logger import get_logger

logger = get_logger()


def export_to_geofile(
    stats: pd.DataFrame,
    output_filepath: str,
    driver: str = 'GeoJSON',
    layer: str = None,
    crs: int = DEFAULT_CRS
) -> bool:
    """
    Exporte un DataFrame Pandas contenant des géométries dans un fichier au format souhaite.

    Args:
        stats (pd.DataFrame): Le DataFrame contenant les statistiques, avec une colonne nommée 'geometry' qui contient des géométries 
                               au format GeoJSON (sous forme de chaînes JSON).
        output_filepath (str): Le chemin complet du fichier de sortie
        driver (str): Le format du fichier de sortie (.geojson, .gpkg, ...)
        layer (str): Le nom du layer si le format de sortie est GPKG
        crs (int): Le crs du fichier de sortie

    Returns:
        bool: Retourne `True` si l'exportation a réussi, sinon lève une exception.

    Raises:
        ValueError: Si la colonne 'geometry' n'est pas présente dans le DataFrame ou si aucune géométrie valide n'a pu être convertie.
        Exception: Si une erreur générale survient pendant la conversion ou l'exportation.

    Example:
        >>> import pandas as pd
        >>> df = pd.DataFrame({
        >>>     'surface_utile': [11120, 800000],
        >>>     'geometry': ['{"type":"Polygon","coordinates":[[[2.319887543, 48.8588443]]]}', 
        >>>                  '{"type":"Polygon","coordinates":[[[2.319888, 48.858845]]]}']
        >>> })
        >>> export_to_geofile(df, "output.geojson")
        True

    Notes:
        - Les géométries dans la colonne 'geometry' doivent être des chaînes JSON valides au format GeoJSON.
        - Si une géométrie est invalide ou ne peut être convertie en objet Shapely, elle sera ignorée.
    """
    try:
        if 'geometry' not in stats.columns:
            raise ValueError("La colonne 'geometry' n'existe pas dans le DataFrame.")
        
        # Convertir la colonne 'geometry' (qui est en format GeoJSON) en objets géométriques Shapely
        def safe_geojson_to_geometry(geojson_value):
            try:
                if not isinstance(geojson_value, str) or not geojson_value.strip():
                    return None  # Ignore les valeurs None ou vides
                
                geom_dict = json.loads(geojson_value)
                return shapely.geometry.shape(geom_dict)
            except Exception as e:
                logger.error("Erreur de conversion pour la géométrie: %s", e)
                return None

        # Pour pouvoir ré-exécuter la fonction sans souci.
        df = stats.copy()
        df['geometry'] = df['geometry'].apply(safe_geojson_to_geometry)
        df = df.dropna(subset=['geometry'])

        if df['geometry'].empty:
            raise ValueError("Aucune géométrie valide après conversion.")

        gdf = gpd.GeoDataFrame(df, geometry='geometry', crs=crs)

        if driver == 'GPKG':
            gdf.to_file(output_filepath, layer=layer, driver=driver)
        else:
            gdf.to_file(output_filepath, driver=driver)

        logger.info("Fichier '%s' créé avec succès ✅", output_filepath)

        return True
    except Exception as e:
        logger.error(f"Erreur lors de l'exportation vers {driver}: {e}")
        raise Exception(f"Erreur lors de l'exportation vers {driver}: {e}") from e
