## Explications et exemples de bonnes pratiques pour le code l'algorithme
Note : le code montré est purement illustratif et ne présage en rien de la réelle méthode de calcul d'une surface utile.

1. Supposons qu'on parte du code suivant issu d'une exploration dans un notebook 
```Python
Gdf = ... # obtention de cette geodataframe non detaillée dans cet exemple

def surfaceUtile(Gdf):
    # calcul de la surface utile
    Gdf["surface_utile"] = ... 
    ... Gdf["surface"]
    ... Gdf["forme"]
    ... Gdf["orient"]
    ... Gdf["ombres"]
    
    return Gdf

Gdf = surfaceUtile(Gdf)
```

2. Je respecte au mieux la [PEP8](https://peps.python.org/pep-0008/) notamment sur la façon de nommer les classes, fonctions et variables
```Python
gdf = ... # obtention de cette geodataframe non detaillée dans cet exemple

def surface_utile(gdf):
    # calcul de la surface utile
    gdf["surface_utile"] = ... 
    ... gdf["surface"]
    ... gdf["forme"]
    ... gdf["orient"]
    ... gdf["ombres"]
    
    return gdf

gdf = surface_utile(gdf)
```

3. Les arguments des fonctions sont typés / chaque fonction a une docstring à jour
```Python
gdf = ... # obtention de cette geodataframe non detaillée dans cet exemple

def surface_utile(
    gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """Calcule la surface utile pour le PV.
    
    :param gdf: geodataframe des batiments scolaires
    :return: la geodaframe modifiee avec la colonne surface_utile
    """
    # calcul de la surface utile
    gdf["surface_utile"] = ... 
    ... gdf["surface"]
    ... gdf["forme"]
    ... gdf["orient"]
    ... gdf["ombres"]
    
    return gdf

gdf = surface_utile(gdf)
```

4. Les noms des fonctions & variables aident à la lecture et compréhension du code / les commentaires expliquent le **pourquoi**
```Python
batiments_scolaire = ... # obtention de cette geodataframe non detaillée dans cet exemple

def calculer_surface_utile_batiments(
    batiments_scolaire: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """Calcule la surface utile pour le PV.
        
    :param batiments_scolaire: geodataframe des batiments scolaires
    :return: la geodaframe modifiee avec la colonne surface_utile
    """
    # la surface utile est approximée car :
    # - surface totale du toit est proportionnel à la surface au sol
    # - on suppose que le forme / orientation du toit sont homogènes
    # - ...
    batiments_scolaire["surface_utile"] = ... 
    ... batiments_scolaire["surface_totale_au_sol"]
    ... batiments_scolaire["forme_du_toit"]
    ... batiments_scolaire["orientation_du_toit"]
    ... batiments_scolaire["zones_ombragees_du_toit"]
    
    return batiments_scolaire

batiments_scolaire = calculer_surface_utile_batiments(batiments_scolaire)
```

5. J'évite des fonctions qui prennent en argument des dataframes et renvoient celles-ci modifiées
```Python
def calculer_surface_utile_batiment(
    surface_totale_au_sol: float,
    forme_du_toit: str,
    orientation_du_toit: float,
    zones_ombragees_du_toit: Geometry,
) -> float:
    """Calcule la surface utile pour le PV.

    :param surface_totale_au_sol: surface totale au sol du batiment
    :param forme_du_toit : forme du toit (plat, ...)
    :param orientation_du_toit: orientation du toit (en radian)
    :param zones_ombragees_du_toit: geometrie des zones trop ombragees
    :return: la surface utile en m²
    """
    # la surface utile est approximée car :
    # - surface totale du toit est proportionnelle à la surface au sol
    # - on suppose que la forme / orientation du toit sont homogènes
    # - ...
    surface_utile = ... 
    ... surface_totale_au_sol
    ... forme_du_toit
    ... orientation_du_toit
    ... zones_ombragees_du_toit
    
    return surface_utile

batiments_scolaire = ... # obtention de cette geodataframe non detaillée dans cet exemple

batiments_scolaires["surface_utile"] = batiments_scolaires.apply(
       lambda batiment: calculer_surface_utile_batiment(
           surface_totale_au_sol=batiments_scolaires["surface_totale_au_sol"],
           forme_du_toit=batiments_scolaires["forme_du_toit"],
           orientation_du_toit=batiments_scolaires["orientation_du_toit"],
           zones_ombragees_du_toit=batiments_scolaires["zones_ombragees_du_toit"],
       ), axis=1
    )
```
