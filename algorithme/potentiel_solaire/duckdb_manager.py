from importlib.metadata import version

import duckdb
import pandas as pd

from potentiel_solaire.constants import DUCK_DB_PATH


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
        query = """
        SELECT code_departement
        FROM departements 
        GROUP BY code_departement
        """

        return list(conn.query(query).df()["code_departement"].unique())


def get_departements_for_region(code_region: str):
    with get_connection() as conn:
        query = f"""
        SELECT code_departement
        FROM departements 
        WHERE code_region = '{code_region}'
        GROUP BY code_departement
        """

        return list(conn.query(query).df()["code_departement"].unique())


def get_regions():
    with get_connection() as conn:
        query = """
        SELECT code_region
        FROM regions 
        GROUP BY code_region
        """

        return list(conn.query(query).df()["code_region"].unique())


def save_solar_potential_by_school(
    results_by_school: pd.DataFrame,
):
    with get_connection() as conn:
        conn.register("results_by_school", results_by_school)

        code_version = version('potentiel_solaire')

        update_query = f"""
            UPDATE etablissements
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
                etablissements.identifiant_de_l_etablissement = results_by_school.identifiant_de_l_etablissement
        """

        conn.execute(update_query)


def save_solar_potential_by_commune(
    code_departement: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE communes
            SET 
                nb_eleves_primaires = agg.nb_eleves,
                nb_etablissements_primaires = agg.nb_etablissements,
                nb_etablissements_proteges_primaires = agg.nb_etablissements_proteges,
                surface_exploitable_max_primaires = agg.surface_exploitable_max,
                potentiel_solaire_primaires = agg.potentiel_solaire,
                potentiel_nb_foyers_primaires = ROUND(agg.potentiel_solaire / 5000),
            FROM (
                SELECT 
                    code_commune,
                    SUM(nb_eleves) AS nb_eleves,
                    COUNT(*) AS nb_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges,
                    SUM(surface_exploitable_max) AS surface_exploitable_max,
                    SUM(potentiel_solaire) AS potentiel_solaire,  
                FROM etablissements
                WHERE 
                    type_etablissement = 'Ecole'
                    AND code_departement = '{code_departement}'
                GROUP BY code_commune
            ) AS agg
            WHERE
                communes.code_commune = agg.code_commune;
            
            UPDATE communes
            SET 
                top_etablissements_primaires = agg.top_etablissements_primaires
            FROM (
                SELECT 
                    code_commune,
                    list(etablissement_json)::JSON AS top_etablissements_primaires,
                FROM (
                    SELECT 
                        code_commune,
                        ROW_NUMBER() OVER (PARTITION BY code_commune ORDER BY potentiel_solaire DESC) AS rank_commune,
                        json_object(
                            'id', identifiant_de_l_etablissement, 
                            'libelle', nom_etablissement, 
                            'potentiel_solaire', potentiel_solaire
                        ) AS etablissement_json,
                    FROM etablissements
                    WHERE 
                        type_etablissement = 'Ecole' 
                        AND NOT protection 
                        AND potentiel_solaire > 0
                        AND code_departement = '{code_departement}'
                    ORDER BY code_commune, potentiel_solaire DESC
                )
                WHERE rank_commune <= 3
                GROUP BY code_commune
            ) AS agg
            WHERE 
                communes.code_commune = agg.code_commune;    
            """

        conn.execute(update_query)


def save_solar_potential_by_department(
    code_departement: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE departements
            SET 
                nb_eleves_colleges = agg.nb_eleves,
                nb_etablissements_colleges = agg.nb_etablissements,
                nb_etablissements_proteges_colleges = agg.nb_etablissements_proteges,
                surface_exploitable_max_colleges = agg.surface_exploitable_max,
                potentiel_solaire_colleges = agg.potentiel_solaire,
                potentiel_nb_foyers_colleges = ROUND(agg.potentiel_solaire / 5000),
            FROM (
                SELECT 
                    code_departement,
                    SUM(nb_eleves) AS nb_eleves,
                    COUNT(*) AS nb_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges,
                    SUM(surface_exploitable_max) AS surface_exploitable_max,
                    SUM(potentiel_solaire) AS potentiel_solaire,
                FROM etablissements
                WHERE 
                    type_etablissement = 'Collège'
                    AND code_departement = '{code_departement}'
                GROUP BY code_departement
            ) AS agg
            WHERE
                departements.code_departement = agg.code_departement;

            UPDATE departements
            SET 
                top_etablissements_colleges = agg.top_etablissements_colleges
            FROM (
                SELECT 
                    code_departement,
                    list(etablissement_json)::JSON AS top_etablissements_colleges,
                FROM (
                    SELECT 
                        code_departement,
                        ROW_NUMBER() OVER (PARTITION BY code_departement ORDER BY potentiel_solaire DESC) AS rank_departement,
                        json_object(
                            'id', identifiant_de_l_etablissement, 
                            'libelle', nom_etablissement, 
                            'potentiel_solaire', potentiel_solaire
                        ) AS etablissement_json,
                    FROM etablissements
                    WHERE 
                        type_etablissement = 'Collège' 
                        AND NOT protection 
                        AND potentiel_solaire > 0
                        AND code_departement = '{code_departement}'
                    ORDER BY code_departement, potentiel_solaire DESC
                )
                WHERE rank_departement <= 3
                GROUP BY code_departement
            ) AS agg
            WHERE 
                departements.code_departement = agg.code_departement;
            """

        conn.execute(update_query)


def save_solar_potential_by_region(
    code_region: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE regions
            SET 
                nb_eleves_lycees = agg.nb_eleves,
                nb_etablissements_lycees = agg.nb_etablissements,
                nb_etablissements_proteges_lycees = agg.nb_etablissements_proteges,
                surface_exploitable_max_lycees = agg.surface_exploitable_max,
                potentiel_solaire_lycees = agg.potentiel_solaire,
                potentiel_nb_foyers_lycees = ROUND(agg.potentiel_solaire / 5000),
            FROM (
                SELECT 
                    code_region,
                    SUM(nb_eleves) AS nb_eleves,
                    COUNT(*) AS nb_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges,
                    SUM(surface_exploitable_max) AS surface_exploitable_max,
                    SUM(potentiel_solaire) AS potentiel_solaire,
                FROM etablissements
                WHERE 
                    type_etablissement = 'Lycée'
                    AND code_region = '{code_region}'
                GROUP BY code_region
            ) AS agg
            WHERE
                regions.code_region = agg.code_region;

            UPDATE regions
            SET 
                top_etablissements_lycees = agg.top_etablissements_lycees
            FROM (
                SELECT 
                    code_region,
                    list(etablissement_json)::JSON AS top_etablissements_lycees,
                FROM (
                    SELECT 
                        code_region,
                        ROW_NUMBER() OVER (PARTITION BY code_region ORDER BY potentiel_solaire DESC) AS rank_region,
                        json_object(
                            'id', identifiant_de_l_etablissement, 
                            'libelle', nom_etablissement, 
                            'potentiel_solaire', potentiel_solaire
                        ) AS etablissement_json,
                    FROM etablissements
                    WHERE 
                        type_etablissement = 'Lycée' 
                        AND NOT protection 
                        AND potentiel_solaire > 0
                        AND code_region = '{code_region}'
                    ORDER BY code_region, potentiel_solaire DESC
                )
                WHERE rank_region <= 3
                GROUP BY code_region
            ) AS agg
            WHERE 
                regions.code_region = agg.code_region;
            """

        conn.execute(update_query)
