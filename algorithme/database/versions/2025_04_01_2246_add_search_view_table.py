"""add search view table

Revision ID: 40edc8af2a08
Revises: feec43549927
Create Date: 2025-04-01 22:46:38.969470

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '40edc8af2a08'
down_revision: Union[str, None] = 'feec43549927'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# schema
etablissements_table = "etablissements"
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"
search_view_table = "search_view"


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # create materialized view with a common libelle column on every tables
    # On nettoie le libellé dans la colonne sanitized_libelle :
    # 1. suppression des accents
    # 2. remplacement de la ponctuation par des espaces
    # 3. suppression des doublons d'espaces
    # 4. conversion en lowercase.
    op.execute(f"""
        CREATE OR REPLACE TABLE {search_view_table} AS 

        SELECT 
            '{etablissements_table}' AS source_table, 
            identifiant_de_l_etablissement as id, 
            nom_etablissement AS libelle, 
            lower(regexp_replace(regexp_replace(strip_accents(nom_etablissement), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle, 
            to_json(struct_pack(nom_commune, code_postal)) AS extra_data 
        FROM {etablissements_table}

        UNION ALL

        SELECT 
            '{communes_table}' AS source_table, 
            code_commune AS id, 
            nom_commune AS libelle, 
            lower(regexp_replace(regexp_replace(strip_accents(nom_commune), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle, 
            NULL::json AS extra_data 
        FROM {communes_table}

        UNION ALL

        SELECT 
            '{departements_table}' AS source_table,
            code_departement AS id,
            libelle_departement AS libelle,
            lower(regexp_replace(regexp_replace(strip_accents(libelle_departement), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle,
            NULL::json AS extra_data 
        FROM {departements_table}

        UNION ALL

        SELECT 
            '{regions_table}' AS source_table,
            code_region AS id,
            libelle_region AS libelle,
            lower(regexp_replace(regexp_replace(strip_accents(libelle_region), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle,
        NULL::json AS extra_data 
        FROM {regions_table};
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # drop the search view table
    op.execute(f"DROP TABLE IF EXISTS {search_view_table};")
