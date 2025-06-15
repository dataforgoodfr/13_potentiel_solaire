"""add priority cities table

Revision ID: 4c2566ff3562
Revises: 5f96d921513d
Create Date: 2025-06-14 13:18:07.066461

"""
from typing import Sequence, Union

from alembic import op

from potentiel_solaire.constants import DATABASE_FOLDER


# revision identifiers, used by Alembic.
revision: str = '4c2566ff3562'
down_revision: Union[str, None] = '5f96d921513d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
villes_prioritaires_table: str = 'villes_prioritaires'


def upgrade() -> None:
    """Upgrade schema."""
    villes_prioritaires_path = DATABASE_FOLDER / 'villes_prioritaires' / '*.csv'
    
    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {villes_prioritaires_table} AS (
            SELECT
                ville,
                code_commune
            FROM
                '{villes_prioritaires_path}'
        );
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute(f"""
        DROP TABLE IF EXISTS {villes_prioritaires_table};
    """)
