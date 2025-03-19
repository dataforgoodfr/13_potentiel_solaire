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
    code_departement: str
):
    with get_connection() as conn:
        conn.register("results_by_school", results_by_school)

        update_query = """
            UPDATE etablissements
            SET 
                surface_utile = results_by_school.surface_utile,
                potentiel_solaire = results_by_school.potentiel_solaire,
                protection = results_by_school.protection
            FROM
                results_by_school
            WHERE
                etablissements.identifiant_de_l_etablissement = results_by_school.identifiant_de_l_etablissement
        """

        conn.execute(update_query)

        query = f"""
            SELECT
                *,
                ST_AsGeoJSON(geo_point) as geometry
            FROM
                etablissements
            WHERE
            code_departement = '{code_departement}'
            """

        stats_schools = conn.query(query).df()

        return stats_schools


def save_solar_potential_by_commune(
    code_departement: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE communes
            SET 
                surface_utile = agg.surface_utile,
                potentiel_solaire = agg.potentiel_solaire,
                count_etablissements = agg.count_etablissements,
                count_etablissements_proteges = agg.count_etablissements_proteges
            FROM (
                SELECT 
                    code_commune,
                    SUM(surface_utile) AS surface_utile,
                    SUM(potentiel_solaire) AS potentiel_solaire,
                    COUNT(*) AS count_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
                FROM etablissements
                GROUP BY code_commune
            ) AS agg
            WHERE
            communes.code_commune = agg.code_commune
            AND communes.code_departement = '{code_departement}'
            """

        conn.execute(update_query)

        query = f"""
        SELECT
            *,
            ST_AsGeoJSON(geom) as geometry
        FROM
            communes
        WHERE
            code_departement = '{code_departement}'
                """

        return conn.query(query).df()


def save_solar_potential_by_department(
    code_departement: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE departements
            SET 
                surface_utile = agg.surface_utile,
                potentiel_solaire = agg.potentiel_solaire,
                count_etablissements = agg.count_etablissements,
                count_etablissements_proteges = agg.count_etablissements_proteges
            FROM (
                SELECT 
                    code_departement,
                    SUM(surface_utile) AS surface_utile,
                    SUM(potentiel_solaire) AS potentiel_solaire,
                    COUNT(*) AS count_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
                FROM etablissements
                GROUP BY code_departement
            ) AS agg
            WHERE
                departements.code_departement = agg.code_departement
                AND departements.code_departement = '{code_departement}'
            """

        conn.execute(update_query)

        query = f"""
            SELECT
                *,
                ST_AsGeoJSON(geom) as geometry 
            FROM
                departements WHERE code_departement = '{code_departement}'
            """
        return conn.query(query).df()


def save_solar_potential_by_region(
    code_region: str
):
    with get_connection() as conn:
        update_query = f"""
            UPDATE regions
            SET 
                surface_utile = agg.surface_utile,
                potentiel_solaire = agg.potentiel_solaire,
                count_etablissements = agg.count_etablissements,
                count_etablissements_proteges = agg.count_etablissements_proteges
            FROM (
                SELECT 
                    code_region,
                    SUM(surface_utile) AS surface_utile,
                    SUM(potentiel_solaire) AS potentiel_solaire,
                    COUNT(*) AS count_etablissements,
                    SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
                FROM etablissements
                GROUP BY code_region
            ) AS agg
            WHERE
                regions.code_region = agg.code_region
                AND regions.code_region = '{code_region}'
            """

        conn.execute(update_query)

        query = f"""
            SELECT
                *,
                ST_AsGeoJSON(geom) as geometry 
            FROM
                regions WHERE code_region = '{code_region}'
            """
        return conn.query(query).df()
