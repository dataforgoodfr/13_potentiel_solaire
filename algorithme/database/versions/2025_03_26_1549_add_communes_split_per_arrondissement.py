from typing import Sequence, Union

from alembic import op

from potentiel_solaire.sources.communes import create_communes_dataset_with_arrondissement
from potentiel_solaire.sources.extract import extract_sources

# revision identifiers, used by Alembic.
revision: str = '6ae9d430a286'
down_revision: Union[str, None] = '73f36b7b95ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

sources = extract_sources()
create_communes_dataset_with_arrondissement()

communes_table = "communes"
communes_path = sources["communes"].filepath

def upgrade() -> None:
    """Upgrade schema."""
    
    # Drop the existing communes table
    op.execute(f"""
        DROP TABLE IF EXISTS {communes_table} CASCADE
    """)
    
    # Create a new communes table
    op.execute(f"""
        CREATE TABLE {communes_table} AS
        SELECT
            codgeo AS code_commune,
            libgeo AS nom_commune,
            LPAD(dep, 3, '0') AS code_departement,
            (SELECT libelle_departement FROM departements dept WHERE dept.code_departement = LPAD(com.dep, 3, '0')) AS libelle_departement,
            reg AS code_region,
            (SELECT libelle_region FROM regions r WHERE r.code_region = com.reg) AS libelle_region,
            0 AS surface_utile,
            0::BIGINT AS potentiel_solaire,
            0 AS count_etablissements,
            0 AS count_etablissements_proteges,
            geom
        FROM
            ST_Read('{communes_path}') com
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
