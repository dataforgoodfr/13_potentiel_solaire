def cree_adresse(df: 'pd.DataFrame', cols: list[str] = None) -> 'pd.Series':
    """
    Construit une adresse complète à partir des colonnes spécifiées d'un DataFrame.

    Args:
        df (pd.DataFrame): Le DataFrame contenant les colonnes d'adresse.
        cols (list[str], optional): Liste des noms de colonnes à utiliser pour l'adresse.
            Par défaut ["adresse_1", "code_postal", "nom_commune"].

    Returns:
        pd.Series: Série contenant les adresses concaténées.
    """
    if cols is None:
        cols = ["adresse_1", "code_postal", "nom_commune"]
    return df[cols].fillna(" ").apply(lambda x: ' '.join(x.values), axis=1)


def geocode(adresse: str) -> 'Point | None':
    """
    Géocode une adresse en utilisant l'API IGN (data.geopf.fr).

    Args:
        adresse (str): L'adresse à géocoder, typiquement obtenue via cree_adresse().

    Returns:
        Point | None: Un objet Point avec les coordonnées géographiques (WGS84) ou None si échec.
    """
    #time.sleep(0.1)
    r = requests.get(url="https://data.geopf.fr/geocodage/search",
                     params={"q": adresse})
    if not r.ok:
        return None
    try:
        js = r.json()
        return Point(js['features'][0]['geometry']['coordinates'])
    except:
        return None

def calcul_dist(df: 'pd.DataFrame', col1: str, col2: str, crs: str = projglob) -> 'pd.Series':
    """
    Calcule la distance entre deux colonnes de géométrie dans un DataFrame.

    Args:
        df (pd.DataFrame): Le DataFrame contenant les colonnes de géométrie.
        col1 (str): Nom de la première colonne.
        col2 (str): Nom de la seconde colonne.
        crs (str, optional): Système de référence de coordonnées cible. Par défaut projglob.

    Returns:
        pd.Series: Série contenant les distances calculées.
    """
    return gpd.GeoSeries(df[col1], crs="WGS84").to_crs(crs)\
        .distance(gpd.GeoSeries(df[col2], crs="WGS84").to_crs(crs))





def reduction_ecarts(df: 'pd.DataFrame', seuil: int = 300) -> None:
    """
    Réduit les écarts de géolocalisation en optimisant les points selon la distance à un polygone.

    Args:
        df (pd.DataFrame): DataFrame contenant les colonnes 'geometry' et 'polygon'.
        seuil (int, optional): Seuil de distance pour optimisation. Par défaut 300.

    Modifie le DataFrame en ajoutant les colonnes:
        - 'dist': distance entre 'geometry' et 'polygon'
        - 'adresse': adresse concaténée
        - 'optim_geo': géométrie optimisée
        - 'optim_dist': distance entre 'polygon' et 'optim_geo'
        - 'final_pt': point final optimisé
    """
    df["dist"] = calcul_dist(df, "geometry", "polygon")
    df["adresse"] = cree_adresse(df)
    df["optim_geo"] = df.apply(lambda x: x["geometry"] if x["dist"] < seuil else geocode(x["adresse"]), axis=1)
    df["optim_dist"] = calcul_dist(df, "polygon", "optim_geo")
    df["final_pt"] = df.apply(lambda x: x["optim_geo"] if x["optim_dist"] < seuil else x["polygon"].centroid, axis=1)
    return df

df=dfm.sample(100).copy()