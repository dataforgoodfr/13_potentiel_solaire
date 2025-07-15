"""add columns to etablissements table to help identification of ambiguity cases

Revision ID: 23cd0f69239a
Revises: f33b80454ef2
Create Date: 2025-07-06 10:52:54.579183

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '23cd0f69239a'
down_revision: Union[str, None] = 'f33b80454ef2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# schema
etablissements_table = "etablissements"
new_columns = [
    ("identifiant_topo_zone_rattachee", "VARCHAR", "NULL"),
    ("est_seul_dans_sa_zone", "BOOLEAN", "NULL"),
    ("reussite_rattachement", "BOOLEAN", "NULL"),
    ("potentiel_solaire_zone", "BIGINT", 0),
]


def upgrade() -> None:
    """Upgrade schema."""
    # Ajout des colonnes pour les attributs supplémentaires
    for column_name, column_type, column_default in new_columns:
        op.execute(f"""
            ALTER TABLE {etablissements_table}
            ADD COLUMN IF NOT EXISTS {column_name} {column_type} DEFAULT {column_default}
        """)


def downgrade() -> None:
    """Downgrade schema."""
    # Suppression des colonnes pour les attributs supplémentaires
    for column_name, _, _ in new_columns:
        op.execute(f"""
            ALTER TABLE {etablissements_table}
            DROP COLUMN IF EXISTS {column_name}
        """)
