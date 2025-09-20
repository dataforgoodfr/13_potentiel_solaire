"""update seuils niveau potentiel

Revision ID: dd919c523425
Revises: 23cd0f69239a
Create Date: 2025-09-20 13:53:55.845500

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd919c523425'
down_revision: Union[str, None] = '23cd0f69239a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

seuils_niveaux_potentiels_table = "seuils_niveaux_potentiels"


def upgrade() -> None:
    """Upgrade schema."""
    # Delete existing values in seuils_niveaux_potentiels table
    op.execute(f"DELETE FROM {seuils_niveaux_potentiels_table}")

    # Insert new values into seuils_niveaux_potentiels table
    op.execute(f"""
        INSERT INTO {seuils_niveaux_potentiels_table} 
            (niveau_potentiel, min_potentiel_solaire, max_potentiel_solaire)
        VALUES
            ('1_HIGH', 361000, 999999999999),
            ('2_GOOD', 177000, 360999), 
            ('3_LIMITED', 0, 176999)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Delete existing values in seuils_niveaux_potentiels table
    op.execute(f"DELETE FROM {seuils_niveaux_potentiels_table}")

    # Insert old values into seuils_niveaux_potentiels table
    op.execute(f"""
        INSERT INTO {seuils_niveaux_potentiels_table} 
            (niveau_potentiel, min_potentiel_solaire, max_potentiel_solaire)
        VALUES
            ('1_HIGH', 250000, 999999999999),
            ('2_GOOD', 100000, 249999), 
            ('3_LIMITED', 0, 99999)
    """)
