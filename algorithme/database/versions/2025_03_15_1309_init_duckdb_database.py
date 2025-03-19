"""init duckdb database

Revision ID: 73f36b7b95ee
Revises: 
Create Date: 2025-03-15 13:09:25.501009

"""
from typing import Sequence, Union

from alembic import op

from potentiel_solaire.sources.extract import extract_sources

# revision identifiers, used by Alembic.
revision: str = '73f36b7b95ee'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# extract sources
sources = extract_sources()

# schema
regions_table = "regions"
regions_path = sources["regions"].filepath

departements_table = "departements"
departements_path = sources["departements"].filepath

communes_table = "communes"
communes_path = sources["communes"].filepath

etablissements_table = "etablissements"
etablissements_path = sources["etablissements"].filepath


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {regions_table} AS
        SELECT
            reg AS code_region,
            libgeo AS libelle_region,
            0 AS surface_utile,
            0::BIGINT AS potentiel_solaire,
            0 AS count_etablissements,
            0 AS count_etablissements_proteges,
            geom
        FROM
            ST_Read('{regions_path}') reg
    """)

    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {departements_table} AS
            SELECT
                LPAD(dep, 3, '0') AS code_departement,
                libgeo AS libelle_departement,
                reg AS code_region,
                (SELECT libelle_region FROM regions r WHERE r.code_region = dept.reg) AS libelle_region,
                0 AS surface_utile,
                0::BIGINT AS potentiel_solaire,
                0 AS count_etablissements,
                0 AS count_etablissements_proteges,
                geom
            FROM
                ST_Read('{departements_path}') dept
    """)

    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {communes_table} AS
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

    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {etablissements_table} AS
            SELECT
                identifiant_de_l_etablissement,
                nom_etablissement,
                type_etablissement,
                libelle_nature,
                code_commune,
                nom_commune,
                code_departement,
                libelle_departement,
                code_region,
                libelle_region,
                0 AS surface_utile,
                0::BIGINT AS potentiel_solaire,
                FALSE AS protection,
                ST_PointOnSurface(geom) as geo_point
            FROM
                ST_Read('{etablissements_path}')
            WHERE
                type_etablissement IN ('Ecole', 'Lycée', 'Collège')
                AND statut_public_prive = 'Public'
                AND etat = 'OUVERT'
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table(etablissements_table, if_exists=True)
    op.drop_table(communes_table, if_exists=True)
    op.drop_table(departements_table, if_exists=True)
    op.drop_table(regions_table, if_exists=True)
