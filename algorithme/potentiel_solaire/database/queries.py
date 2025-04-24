from importlib.metadata import version
from typing import Literal, Optional

import duckdb
import pandas as pd

from potentiel_solaire.constants import DUCK_DB_PATH
from potentiel_solaire.database.models import (
    Table,
    etablissements_table,
    communes_table,
    departements_table,
    regions_table,
    seuils_niveaux_potentiels_table,
)
from potentiel_solaire.logger import get_logger

logger = get_logger()


def get_connection():
    conn = duckdb.connect(DUCK_DB_PATH)

    # Load Spatial extension
    conn.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    conn.commit()

    return conn


def get_departements():
    with get_connection() as conn:
        query = f"""
        SELECT {departements_table.pkey} AS code_departement
        FROM {departements_table.name} 
        GROUP BY {departements_table.pkey}
        """

        return list(conn.query(query).df()["code_departement"].unique())


def get_departements_for_region(code_region: str):
    with get_connection() as conn:
        query = f"""
        SELECT {departements_table.pkey} AS code_departement
        FROM {departements_table.name}  
        WHERE {regions_table.pkey} = '{code_region}'
        GROUP BY {departements_table.pkey}
        """

        return list(conn.query(query).df()["code_departement"].unique())


def get_regions():
    with get_connection() as conn:
        query = f"""
        SELECT {regions_table.pkey} AS code_region
        FROM {regions_table.name} 
        GROUP BY {regions_table.pkey}
        """

        return list(conn.query(query).df()["code_region"].unique())


def update_results_for_schools(
    results_by_school: pd.DataFrame,
):
    with get_connection() as conn:
        conn.register("results_by_school", results_by_school)

        code_version = version('potentiel_solaire')

        update_query = f"""
            UPDATE {etablissements_table.name}
            SET 
                surface_exploitable_max = results_by_school.surface_utile,
                potentiel_solaire = results_by_school.potentiel_solaire,
                protection = results_by_school.protection,
                date_calcul = CURRENT_TIMESTAMP,
                version = '{code_version}',
                nb_batiments_associes = results_by_school.nb_batiments_associes
            FROM
                results_by_school
            WHERE
                {etablissements_table.name}.{etablissements_table.pkey} = results_by_school.identifiant_de_l_etablissement
        """

        conn.execute(update_query)


def check_if_results_for_schools_are_exhaustive():
    """Verifier si les resultats pour les ecoles sont exhaustifs et faits avec la meme version"""
    with get_connection() as conn:
        # Verifier si tous les etablissements ont ete traites avec la meme version
        code_version = version('potentiel_solaire')

        query = f"""
            SELECT code_departement, COUNT(*) AS nb_etablissements
            FROM {etablissements_table.name}
            WHERE date_calcul IS NULL 
                  OR version IS NULL 
                  OR version != '{code_version}'
            GROUP BY code_departement
        """

        result = conn.query(query).df()

        nb_missing_schools = result["nb_etablissements"].sum()
        departements_missing = result["code_departement"].unique()

        if  nb_missing_schools > 0:
            message = (
                f"Le potentiel n a pas ete calcule pour {nb_missing_schools} etablissements "
                f"sur la version attendue de l algorithme : {code_version}. "
                f"Merci de lancer les calculs de potentiel solaire. "
                f"{len(departements_missing)} departements manquants : {departements_missing}."
            )
            logger.error(message)
            raise ValueError(message)

        return True


def update_indicators_for_table(
    table: Table,
    suffix: Literal["_primaires", "_colleges", "_lycees", "_total"] = "_total",
    type_etablissement: Optional[Literal["Ecole", "Collège", "Lycée"]] = None
):
    """Update des indicateurs pour une aggregation donnee
    
    Args:
        table (Table): Table cible pour l aggregation
        suffix (str): Suffixe a ajouter au nom des indicateurs
        type_etablissement (str): Type d etablissement a filtrer, 
            si aucun type n est indique, tous les etablissements sont pris en compte
    """
    # Filtre sur le type d'etablissement si indique
    agg_filter = f"type_etablissement = '{type_etablissement}'" if type_etablissement else "1 = 1"

    update_query = f"""
    -- Update des indicateurs simples
    WITH 
        agg AS (
            SELECT 
                {table.pkey} AS code_zone,
                SUM(COALESCE(nb_eleves, 0)) AS nb_eleves,
                COUNT(*) AS nb_etablissements,
                SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges,
                SUM(surface_exploitable_max) AS surface_exploitable_max,
                SUM(potentiel_solaire) AS potentiel_solaire,

            FROM {etablissements_table.name}
            WHERE {agg_filter}
            GROUP BY code_zone
        )


    UPDATE {table.name}
    SET 
        nb_eleves{suffix} = agg.nb_eleves,
        nb_etablissements{suffix} = agg.nb_etablissements,
        nb_etablissements_proteges{suffix} = agg.nb_etablissements_proteges,
        surface_exploitable_max{suffix} = agg.surface_exploitable_max,
        potentiel_solaire{suffix} = agg.potentiel_solaire,
        potentiel_nb_foyers{suffix} = FLOOR(agg.potentiel_solaire / 5000),
    FROM agg
    WHERE {table.name}.{table.pkey} = agg.code_zone;


    -- Update du top 3 des etablissements
    WITH
        top_etablissements AS (
            SELECT
                {table.pkey} AS code_zone,
                json_object(
                    'id', {etablissements_table.pkey}, 
                    'libelle', nom_etablissement, 
                    'type_etablissement', type_etablissement,
                    'potentiel_solaire', potentiel_solaire
                ) AS etablissement_json,
            FROM {etablissements_table.name}
            WHERE {agg_filter} 
                AND NOT protection 
                AND potentiel_solaire > 0
            QUALIFY ROW_NUMBER() OVER (PARTITION BY {table.pkey} ORDER BY potentiel_solaire DESC) <= 3
            ORDER BY code_zone, potentiel_solaire DESC
        ),
                
        agg AS (
            SELECT
                code_zone,
                list(etablissement_json)::JSON AS top_etablissements
            FROM top_etablissements
            GROUP BY code_zone
        )
            
    UPDATE {table.name}
    SET
        top_etablissements{suffix} = agg.top_etablissements
    FROM agg
    WHERE {table.name}.{table.pkey} = agg.code_zone;


    -- Update du nombre d etablissements par niveau potentiel
    WITH 
        zone_et_niveaux AS (
            SELECT 
                DISTINCT e.{table.pkey} AS code_zone, 
                s.{seuils_niveaux_potentiels_table.pkey} AS niveau_potentiel
            FROM {etablissements_table.name} e
            CROSS JOIN {seuils_niveaux_potentiels_table.name} s
        ),
        
        agg_par_zone_et_niveau AS (
            SELECT 
                {table.pkey} AS code_zone,
                {seuils_niveaux_potentiels_table.pkey} AS niveau_potentiel,
                COUNT(*) AS nb_etablissements,
            FROM {etablissements_table.name}
            WHERE {agg_filter}
            GROUP BY code_zone, niveau_potentiel
        ),
        
        nb_etablissements_par_zone_et_niveau AS (
            SELECT 
                zn.code_zone,
                zn.niveau_potentiel,
                COALESCE(agg.nb_etablissements, 0) AS nb_etablissements
            FROM zone_et_niveaux zn
            LEFT JOIN agg_par_zone_et_niveau agg
                ON zn.code_zone = agg.code_zone
                AND zn.niveau_potentiel = agg.niveau_potentiel
            ORDER BY zn.code_zone, zn.niveau_potentiel
        ),

        agg_par_zone AS (
            SELECT 
                code_zone,
                json_group_object(
                    niveau_potentiel, nb_etablissements
                ) AS nb_etablissements_par_niveau_potentiel
            FROM nb_etablissements_par_zone_et_niveau
            GROUP BY code_zone
        )
    
    UPDATE {table.name}
    SET
        nb_etablissements_par_niveau_potentiel{suffix} = agg_par_zone.nb_etablissements_par_niveau_potentiel
    FROM agg_par_zone
    WHERE {table.name}.{table.pkey} = agg_par_zone.code_zone;
    """
    
    with get_connection() as conn:
        if type_etablissement is None:
            message = (
                f"Update des indicateurs de la table {table.name} "
                "pour tout type d etablissement"
            )
        else:
            message = (
                f"Update des indicateurs de la table {table.name} "
                f"pour les etablissements de type {type_etablissement}"
            )

        logger.info(message)
        conn.execute(update_query)

def update_additional_map_indicators_for_table(table: Table):
    """Update des indicateurs additionnels pour la carte"""
    update_query = f"""
    WITH 
        agg AS (
            SELECT 
                {table.pkey} AS code_zone,
                SUM(CASE WHEN type_etablissement = 'Ecole' THEN potentiel_solaire ELSE 0 END) AS potentiel_solaire_primaires,
                SUM(CASE WHEN type_etablissement = 'Collège' THEN potentiel_solaire ELSE 0 END) AS potentiel_solaire_colleges,
                SUM(CASE WHEN type_etablissement = 'Lycée' THEN potentiel_solaire ELSE 0 END) AS potentiel_solaire_lycees,
            FROM {etablissements_table.name}
            GROUP BY code_zone
        )

    UPDATE {table.name}
    SET 
        potentiel_solaire_primaires = agg.potentiel_solaire_primaires,
        potentiel_solaire_colleges = agg.potentiel_solaire_colleges,
        potentiel_solaire_lycees = agg.potentiel_solaire_lycees,
    FROM agg
    WHERE {table.name}.{table.pkey} = agg.code_zone
    """

    with get_connection() as conn:
        logger.info(f"Update des indicateurs additionnels pour la carte de la table {table.name}")
        conn.execute(update_query)
    

def update_indicators_for_schools():
    """Update des indicateurs de la table etablissements"""
    with get_connection() as conn:
        logger.info("Update des indicateurs de la table etablissements")

        update_query = f"""
        UPDATE {etablissements_table.name}
        SET 
            niveau_potentiel = s.niveau_potentiel,
            potentiel_nb_foyers = FLOOR(potentiel_solaire / 5000)
        FROM {seuils_niveaux_potentiels_table.name} s
        WHERE potentiel_solaire >= s.min_potentiel_solaire
              AND potentiel_solaire <= s.max_potentiel_solaire
        """

        conn.execute(update_query)


def update_indicators_for_communes():
    """Update des indicateurs de la table communes"""
    # Calcul des indicateurs sans filtre sur le type d etablissement
    update_indicators_for_table(table=communes_table)

    # Calcul des indicateurs en filtrant sur les ecoles primaires
    update_indicators_for_table(
        table=communes_table, 
        suffix="_primaires", 
        type_etablissement="Ecole"
    )

    # Calcul des indicateurs utiles pour la carte par commune
    update_additional_map_indicators_for_table(table=communes_table)


def update_indicators_for_departements():
    """Update des indicateurs de la table departements"""
    # Calcul des indicateurs sans filtre sur le type d etablissement
    update_indicators_for_table(table=departements_table, suffix="_total")

    # Calcul des indicateurs en filtrant sur les colleges
    update_indicators_for_table(
        table=departements_table, 
        suffix="_colleges", 
        type_etablissement="Collège"
    )

    # Calcul des indicateurs utiles pour la carte par departement
    update_additional_map_indicators_for_table(table=departements_table)


def update_indicators_for_regions():
    """Update des indicateurs de la table regions"""
    # Calcul des indicateurs sans filtre sur le type d etablissement
    update_indicators_for_table(table=regions_table, suffix="_total")

    # Calcul des indicateurs en filtrant sur les lycees
    update_indicators_for_table(
        table=regions_table, 
        suffix="_lycees", 
        type_etablissement="Lycée"
    )

    # Calcul des indicateurs utiles pour la carte par region
    update_additional_map_indicators_for_table(table=regions_table)
