"""change geom column name for etablissements table

Revision ID: 49d44d790ee6
Revises: 40edc8af2a08
Create Date: 2025-04-03 20:54:56.037177

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '49d44d790ee6'
down_revision: Union[str, None] = '40edc8af2a08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
etablissements_table = "etablissements"

def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN geo_point TO geom
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN geom TO geo_point
    """)
