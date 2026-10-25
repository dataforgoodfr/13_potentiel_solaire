import duckdb
import geopandas as gpd
import pandas as pd

from potentiel_solaire.classes.source import load_sources
from potentiel_solaire.constants import DEFAULT_CRS
from potentiel_solaire.logger import get_logger

logger = get_logger()

# sources des effectifs : nom de la source -> (colonne identifiant, colonne nombre d eleves)
EFFECTIFS_SOURCES = {
    "effectifs_ecoles": ("numero_ecole", "nombre_total_eleves"),
    "effectifs_colleges": ("numero_college", "nombre_eleves_total"),
    "effectifs_lycees_gt": ("numero_lycee", "nombre_d_eleves"),
    "effectifs_lycees_pro": ("numero_lycee", "nombre_d_eleves"),
}


def get_nombre_d_eleves(
    effectifs_filepaths: dict[str, str] = None,
) -> pd.DataFrame:
    """Calcule le nombre d eleves de chaque etablissement scolaire

    L annuaire de l education ne contient plus le nombre d eleves : on utilise les
    effectifs par etablissement (ecoles, colleges, lycees GT et pro) a la derniere
    rentree scolaire disponible. Les lycees polyvalents sont presents dans les effectifs
    des lycees GT et pro : leurs effectifs sont additionnes.

    :param effectifs_filepaths: chemins des fichiers .parquet des effectifs par nom de source
        (par defaut ceux de sources.yaml)
    :return: dataframe avec les colonnes identifiant_de_l_etablissement et nombre_d_eleves
    """
    if effectifs_filepaths is None:
        sources = load_sources()
        effectifs_filepaths = {name: sources[name].filepath for name in EFFECTIFS_SOURCES}

    effectifs = []
    for name, (id_column, nb_eleves_column) in EFFECTIFS_SOURCES.items():
        effectifs_source = duckdb.read_parquet(str(effectifs_filepaths[name])).df().rename(
            columns={id_column: "identifiant_de_l_etablissement", nb_eleves_column: "nombre_d_eleves"}
        )

        # on garde la derniere rentree scolaire disponible pour chaque etablissement
        derniere_rentree = effectifs_source.groupby(
            "identifiant_de_l_etablissement"
        )["rentree_scolaire"].transform("max")
        effectifs_source = effectifs_source[effectifs_source["rentree_scolaire"] == derniere_rentree]

        effectifs.append(
            effectifs_source[["identifiant_de_l_etablissement", "nombre_d_eleves"]].astype(
                {"nombre_d_eleves": float}
            )
        )

    return pd.concat(effectifs, ignore_index=True).groupby(
        "identifiant_de_l_etablissement", as_index=False
    )["nombre_d_eleves"].sum(min_count=1)


def get_schools_establishments_of_interest(
    schools_filepath: str,
    code_departement: str,
    types_etablissements: list[str],
    statut_public_prive: str,
    etat: str,
    crs: int = DEFAULT_CRS,
    effectifs_filepaths: dict[str, str] = None,
) -> gpd.GeoDataFrame:
    """Filtre et renvoit l annuaire des etablissements scolaires francais

    :param schools_filepath: chemin du fichier avec les donnees des etablissements
    :param code_departement: pour garder les etablissement du departement
    :param types_etablissements: liste des types a garder (Ex: College, ...)
    :param statut_public_prive: statut a garder (ex: Public)
    :param etat: etat de l etablissement (ex: OUVERT)
    :param crs: projection de la gdf renvoyee
    :param effectifs_filepaths: chemins des fichiers des effectifs par nom de source
        (par defaut ceux de sources.yaml)
    :return: geodataframe des etablissements scolaires filtres
    """
    columns = [
        "identifiant_de_l_etablissement",
        "nom_etablissement",
        "type_etablissement",
        "libelle_nature",
        "statut_public_prive",
        "code_commune",
        "nom_commune",
        "code_departement",
        "libelle_departement",
        "code_region",
        "libelle_region",
        "etat",
        "etablissement_mere",
        "nombre_d_eleves",
        "geometry",
    ]

    schools_establishments = gpd.read_file(schools_filepath)
    schools_establishments = schools_establishments[
        (schools_establishments["code_departement"] == code_departement) &
        (schools_establishments["type_etablissement"].isin(types_etablissements)) &
        (schools_establishments["statut_public_prive"] == statut_public_prive) &
        (schools_establishments["etat"] == etat)
    ]

    # ajout du nombre d eleves (absent de l annuaire)
    schools_establishments = schools_establishments.merge(
        get_nombre_d_eleves(effectifs_filepaths=effectifs_filepaths),
        on="identifiant_de_l_etablissement",
        how="left"
    )
    nb_without_effectifs = schools_establishments["nombre_d_eleves"].isna().sum()
    if nb_without_effectifs > 0:
        logger.warning(
            "%s etablissements sur %s n ont pas de nombre d eleves",
            nb_without_effectifs, schools_establishments.shape[0]
        )

    return schools_establishments[columns].to_crs(crs)
