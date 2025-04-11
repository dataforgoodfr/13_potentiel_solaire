"""add indicators for app fiches zone

Revision ID: b80cbbbf68d9
Revises: 49d44d790ee6
Create Date: 2025-04-05 14:57:19.102683

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b80cbbbf68d9'
down_revision: Union[str, None] = '49d44d790ee6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
etablissements_table = "etablissements"
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"

new_columns_for_each_table = {
    communes_table: {
        "nb_eleves_primaires": "INTEGER DEFAULT 0",
        "nb_etablissements_primaires": "INTEGER DEFAULT 0",
        "nb_etablissements_proteges_primaires": "INTEGER DEFAULT 0",
        "surface_exploitable_max_primaires": "INTEGER DEFAULT 0",
        "potentiel_solaire_primaires": "BIGINT DEFAULT 0",
        "potentiel_nb_foyers_primaires": "INTEGER DEFAULT 0",
        "top_etablissements_primaires": "JSON",
    },
    departements_table: {
        "nb_eleves_colleges": "INTEGER DEFAULT 0",
        "nb_etablissements_colleges": "INTEGER DEFAULT 0",
        "nb_etablissements_proteges_colleges": "INTEGER DEFAULT 0",
        "surface_exploitable_max_colleges": "INTEGER DEFAULT 0",
        "potentiel_solaire_colleges": "BIGINT DEFAULT 0",
        "potentiel_nb_foyers_colleges": "INTEGER DEFAULT 0",
        "top_etablissements_colleges": "JSON",
    },
    regions_table: {
        "nb_eleves_lycees": "INTEGER DEFAULT 0",
        "nb_etablissements_lycees": "INTEGER DEFAULT 0",
        "nb_etablissements_proteges_lycees": "INTEGER DEFAULT 0",
        "surface_exploitable_max_lycees": "INTEGER DEFAULT 0",
        "potentiel_solaire_lycees": "BIGINT DEFAULT 0",
        "potentiel_nb_foyers_lycees": "INTEGER DEFAULT 0",
        "top_etablissements_lycees": "JSON",
    },
}


delete_columns = {
    "surface_utile": "INTEGER DEFAULT 0",
    "potentiel_solaire": "BIGINT DEFAULT 0",
    "count_etablissements": "INTEGER DEFAULT 0",
    "count_etablissements_proteges": "INTEGER DEFAULT 0",
}


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Rename column for surface_utile in etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN surface_utile TO surface_exploitable_max
    """)

    # Add new columns to each table
    for table_name, new_columns in new_columns_for_each_table.items():
        for column_name, column_type in new_columns.items():
            op.execute(f"""
                ALTER TABLE {table_name}
                ADD COLUMN IF NOT EXISTS {column_name} {column_type}
            """)

    # Remove columns for each table
    for table_name in new_columns_for_each_table.keys():
        for column_name in delete_columns.keys():
            op.execute(f"""
                ALTER TABLE {table_name}
                DROP COLUMN IF EXISTS {column_name}
            """)
    
    # Update communes table data
    op.execute(f"""
        UPDATE {communes_table}
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
            FROM {etablissements_table}
            WHERE type_etablissement = 'Ecole'
            GROUP BY code_commune
        ) AS agg
        WHERE {communes_table}.code_commune = agg.code_commune
    """)

    op.execute(f"""
        UPDATE {communes_table}
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
                FROM {etablissements_table}
                WHERE type_etablissement = 'Ecole' 
                    AND NOT protection 
                    AND potentiel_solaire > 0
                ORDER BY code_commune, potentiel_solaire DESC
            )
            WHERE rank_commune <= 3
            GROUP BY code_commune
        ) AS agg
        WHERE {communes_table}.code_commune = agg.code_commune
    """)

    # Update departements table data
    op.execute(f"""
        UPDATE {departements_table}
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
            FROM {etablissements_table}
            WHERE type_etablissement = 'Collège'
            GROUP BY code_departement
        ) AS agg
        WHERE {departements_table}.code_departement = agg.code_departement
    """)

    op.execute(f"""
        UPDATE {departements_table}
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
                FROM {etablissements_table}
                WHERE type_etablissement = 'Collège' 
                    AND NOT protection 
                    AND potentiel_solaire > 0
                ORDER BY code_departement, potentiel_solaire DESC
            )
            WHERE rank_departement <= 3
            GROUP BY code_departement
        ) AS agg
        WHERE {departements_table}.code_departement = agg.code_departement
    """)

    # Update regions table data
    op.execute(f"""
        UPDATE {regions_table}
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
            FROM {etablissements_table}
            WHERE type_etablissement = 'Lycée'
            GROUP BY code_region
        ) AS agg
        WHERE {regions_table}.code_region = agg.code_region
    """)

    op.execute(f"""
        UPDATE {regions_table}
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
                FROM {etablissements_table}
                WHERE type_etablissement = 'Lycée' 
                    AND NOT protection 
                    AND potentiel_solaire > 0
                ORDER BY code_region, potentiel_solaire DESC
            )
            WHERE rank_region <= 3
            GROUP BY code_region
        ) AS agg
        WHERE {regions_table}.code_region = agg.code_region
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Remove new columns from each table
    for table_name, new_columns in new_columns_for_each_table.items():
        for column_name in new_columns.keys():
            op.execute(f"""
                ALTER TABLE {table_name}
                DROP COLUMN IF EXISTS {column_name}
            """)
    
    # Re-add deleted columns to each table
    for table_name in new_columns_for_each_table.keys():
        for column_name, column_type in delete_columns.items():
            op.execute(f"""
                ALTER TABLE {table_name}
                ADD COLUMN IF NOT EXISTS {column_name} {column_type}
            """)
    
    # Rename column for surface_exploitable_max in etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN surface_exploitable_max TO surface_utile
    """)

    # Update communes table data
    op.execute(f"""
        UPDATE {communes_table}
        SET 
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges,
        FROM (
            SELECT 
                code_commune,
                SUM(surface_utile) AS surface_utile,
                SUM(potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
            FROM {etablissements_table}
            GROUP BY code_commune
        ) AS agg
        WHERE {communes_table}.code_commune = agg.code_commune
    """)

    # Update departements table data
    op.execute(f"""
        UPDATE {departements_table}
        SET
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges,
        FROM (
            SELECT
                code_departement,
                SUM(surface_utile) AS surface_utile,
                SUM(potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
            FROM {etablissements_table}
            GROUP BY code_departement
        ) AS agg
        WHERE {departements_table}.code_departement = agg.code_departement
    """)

    # Update regions table data
    op.execute(f"""
        UPDATE {regions_table}
        SET
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges,
        FROM (
            SELECT
                code_region,
                SUM(surface_utile) AS surface_utile,
                SUM(potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
            FROM {etablissements_table}
            GROUP BY code_region
        ) AS agg
        WHERE {regions_table}.code_region = agg.code_region
    """)
