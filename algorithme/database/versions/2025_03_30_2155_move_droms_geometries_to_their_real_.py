"""move DROMS geometries to their real position and size

Revision ID: ead6345a90bc
Revises: 9cdde941f829
Create Date: 2025-03-30 21:55:15.454331

"""
from typing import Sequence, Union

from alembic import op

from potentiel_solaire.constants import DATABASE_FOLDER
from potentiel_solaire.sources.extract import extract_sources


# revision identifiers, used by Alembic.
revision: str = 'ead6345a90bc'
down_revision: Union[str, None] = '9cdde941f829'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"

# on utilise les fichiers .geojson simplifies disponibles ici https://github.com/gregoiredavid/france-geojson/tree/master
# ils ont ete telecharges et commit dans le dossier algorithme/database/contours_simplifies_droms


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    droms = [
        "guadeloupe", 
        "martinique", 
        "guyane", 
        "la-reunion",  
        "mayotte", 
    ]
    
    for drom in droms:
        # update pour la geometrie de la region
        region_geojson_path = DATABASE_FOLDER / f"contours_simplifies_droms/region-{drom}.geojson"
        op.execute(f"""
            UPDATE {regions_table}
            SET
                geom = geojson.geom
            FROM (
                SELECT 
                    code AS code_region,
                    geom
                FROM ST_Read('{region_geojson_path}')
            ) AS geojson
            WHERE {regions_table}.code_region = geojson.code_region
        """)

        # update pour la geometrie du departement
        dep_geojson_path = DATABASE_FOLDER / f"contours_simplifies_droms/departements-{drom}.geojson"
        op.execute(f"""
            UPDATE {departements_table}
            SET
                geom = geojson.geom
            FROM (
                SELECT 
                    LPAD(code, 3, '0') AS code_departement,
                    geom
                FROM ST_Read('{dep_geojson_path}')
            ) AS geojson
            WHERE {departements_table}.code_departement = geojson.code_departement
        """)

        # update pour les geometries des communes
        com_geojson_path = DATABASE_FOLDER / f"contours_simplifies_droms/communes-{drom}.geojson"
        op.execute(f"""
            UPDATE {communes_table}
            SET
                geom = geojson.geom
            FROM (
                SELECT 
                    code AS code_commune,
                    geom
                FROM ST_Read('{com_geojson_path}')
            ) AS geojson
            WHERE {communes_table}.code_commune = geojson.code_commune
        """)



def downgrade() -> None:
    """Downgrade schema."""
    sources = extract_sources()
    regions_path = sources["regions"].filepath
    departements_path = sources["departements"].filepath
    communes_path = sources["communes"].filepath

    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    op.execute(f"""
        UPDATE {regions_table}
        SET
            geom = geojson.geom
        FROM (
            SELECT 
                reg AS code_region,
                geom
            FROM ST_Read('{regions_path}')
        ) AS geojson
        WHERE {regions_table}.code_region = geojson.code_region
         AND {regions_table}.code_region IN ('01', '02', '03', '04', '06')
    """)

    op.execute(f"""
        UPDATE {departements_table}
        SET
            geom = geojson.geom
        FROM (
            SELECT 
                LPAD(dep, 3, '0') AS code_departement,
                geom
            FROM ST_Read('{departements_path}')
        ) AS geojson
        WHERE {departements_table}.code_departement = geojson.code_departement
         AND {departements_table}.code_region IN ('01', '02', '03', '04', '06')
    """)

    op.execute(f"""
        UPDATE {communes_table}
        SET
            geom = geojson.geom
        FROM (
            SELECT 
                codgeo AS code_commune,
                geom
            FROM ST_Read('{communes_path}')
        ) AS geojson
        WHERE {communes_table}.code_commune = geojson.code_commune
         AND {communes_table}.code_region IN ('01', '02', '03', '04', '06')
    """)
