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
