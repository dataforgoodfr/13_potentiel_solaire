"""correct etablissements adresses

Revision ID: bc9fa1bdc77c
Revises: dd919c523425
Create Date: 2025-09-21 16:43:38.331116

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from potentiel_solaire.constants import DATABASE_FOLDER


# revision identifiers, used by Alembic.
revision: str = 'bc9fa1bdc77c'
down_revision: Union[str, None] = 'dd919c523425'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
etablissements_table = "etablissements"
initial_adresses_path = DATABASE_FOLDER / "correction_adresses" / "positions_initiales_etablissements.geojson"
corrected_adresses_path = DATABASE_FOLDER / "correction_adresses" / "positions_corrigees_etablissements.geojson"

def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        UPDATE {etablissements_table} AS e
        SET
            geom = c.geom,
        FROM
            ST_Read('{corrected_adresses_path}') AS c
        WHERE
            e.identifiant_de_l_etablissement = c.identifiant_de_l_etablissement
            AND c.geom IS NOT NULL
        """
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        UPDATE {etablissements_table} AS e
        SET
            geom = i.geom
        FROM
            ST_Read('{initial_adresses_path}') AS i
        WHERE
            e.identifiant_de_l_etablissement = i.identifiant_de_l_etablissement
            AND i.geom IS NOT NULL
        """
    )
