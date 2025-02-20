def surface_utile_grossiere(surfacetotale):
    # @TODO Remplacer par une formule plus fine
    if surfacetotale < 500:
        ratio = 0.4*surfacetotale/5000+0.2
        if surfacetotale > 100:
            return ratio*surfacetotale
    else:
        return surfacetotale*0.6
    return 0


def getSurface(batiment):
    crs_init = str(batiment.crs).split(":")[-1]
    #print(crs_init)
    # On calcule les surfaces
    batiment = batiment.to_crs(epsg=6933)
    batiment["surface_totale_calculee"] = batiment.area
    batiment = batiment.to_crs(epsg=int(crs_init))
    return batiment


def getSurfaces(batiments, col_surface="surface_totale_calculee"):
    batiments = getSurface(batiments)
    batiments["surface_utile"] = \
        batiments[col_surface].apply(lambda s: surface_utile_grossiere(s))
    return batiments
