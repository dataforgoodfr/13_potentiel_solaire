"""add administration contacts db

Revision ID: 565435221eac
Revises: bc9fa1bdc77c
Create Date: 2025-10-05 11:33:17.222557

"""
from typing import Sequence, Union

from alembic import op
from potentiel_solaire.sources.extract import extract_sources


# revision identifiers, used by Alembic.
revision: str = '565435221eac'
down_revision: Union[str, None] = 'bc9fa1bdc77c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
annuaire_administration_table = "annuaire_administration"


def upgrade() -> None:
    """Upgrade schema."""
    # extract sources
    sources = extract_sources()
    annuaire_administration_path = sources["annuaire_administration"].filepath

    # load into new table
    op.execute(f"""
    CREATE TABLE IF NOT EXISTS {annuaire_administration_table} AS
        SELECT
            *
        FROM
        read_parquet('{annuaire_administration_path}')
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table(annuaire_administration_table, if_exists=True)
