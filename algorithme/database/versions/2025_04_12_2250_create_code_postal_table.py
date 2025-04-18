"""create code postal table

Revision ID: 5f96d921513d
Revises: b80cbbbf68d9
Create Date: 2025-04-12 22:50:48.145411

"""
from typing import Sequence, Union

from alembic import op

from potentiel_solaire.sources.extract import extract_sources


# revision identifiers, used by Alembic.
revision: str = '5f96d921513d'
down_revision: Union[str, None] = 'b80cbbbf68d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# schema
codes_postaux_table = "ref_code_postal"


def upgrade() -> None:
    """Upgrade schema."""
    sources = extract_sources()
    codes_postaux_path = sources["codes_postaux"].filepath

    op.execute(f"""
        CREATE OR REPLACE TABLE {codes_postaux_table} AS
        SELECT 
            DISTINCT ON(code_insee, code_postal) "#Code_commune_INSEE" AS code_insee, 
            Code_postal AS code_postal
        FROM read_parquet('{codes_postaux_path}')
    """)    


def downgrade() -> None:
    """Downgrade schema."""
    op.execute(f"""
        DROP TABLE IF EXISTS {codes_postaux_table}
    """)
