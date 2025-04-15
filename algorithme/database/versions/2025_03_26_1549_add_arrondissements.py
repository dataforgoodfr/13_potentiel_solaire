from typing import Sequence, Union

from alembic import op

from potentiel_solaire.sources.arrondissements import create_arrondissements_geojson
from potentiel_solaire.sources.extract import extract_sources

# revision identifiers, used by Alembic.
revision: str = '6ae9d430a286'
down_revision: Union[str, None] = '73f36b7b95ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
etablissements_table = "etablissements"
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"

def upgrade() -> None:
    """Upgrade schema."""
    arrondissements_path = create_arrondissements_geojson()

    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)
    
    # Insert arrondissements into communes table
    op.execute(f"""
        INSERT INTO {communes_table} (
            code_commune,
            nom_commune,
            code_departement,
            libelle_departement,
            code_region,
            libelle_region,
            surface_utile,
            potentiel_solaire,
            count_etablissements,
            count_etablissements_proteges,
            geom
        )
        SELECT
            arr.insee_arm AS code_commune,
            arr.nom AS nom_commune,
            CONCAT('0', LPAD(arr.insee_arm, 2, '0')) AS code_departement,
            NULL AS libelle_departement,
            NULL AS code_region,
            NULL AS libelle_region,
            0 AS surface_utile,
            0::BIGINT AS potentiel_solaire,
            0 AS count_etablissements,
            0 AS count_etablissements_proteges,
            arr.geom
        FROM
            ST_Read('{arrondissements_path}') arr
    """)

    # Update communes with department and region information
    op.execute(f"""
        UPDATE {communes_table} c
        SET
            libelle_departement = d.libelle_departement,
            code_region = d.code_region,
            libelle_region = r.libelle_region
        FROM {departements_table} d, {regions_table} r
        WHERE c.code_departement = d.code_departement AND d.code_region = r.code_region
    """)

    # Remove communes for Paris, Lyon and Marseille ('13055', '69123', '75056')
    op.execute(f"""
        DELETE FROM {communes_table}
        WHERE code_commune IN ('13055', '69123', '75056')
    """)

    # Filter TOM (code_region == "00")
    op.execute(f"""
        DELETE FROM {etablissements_table}
        WHERE code_region = '00'
    """)

    # Correct code_commune for new commune Les Trois Lacs (https://fr.wikipedia.org/wiki/Les_Trois_Lacs)
    # In etablissements table, all schools are in the new commune with the correct code ('27676')
    # Yet in communes table the code is still '27058' (the old commune), but other fields such as nom_commune or geom are correct
    op.execute(f"""
        UPDATE {communes_table}
        SET code_commune = '27676'
        WHERE code_commune = '27058'
    """)

    # Lycée polyvalent Lucas de Nehou ('0750463W') is located in '75105' but stated in '75100' in etablissements table
    op.execute(f"""
        UPDATE {etablissements_table}
        SET code_commune = '75105'
        WHERE identifiant_de_l_etablissement = '0750463W'
    """)

    # update solar potential for all schools with previous changes
    op.execute(f"""
        UPDATE {communes_table}
        SET 
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges
        FROM (
            SELECT 
                e.code_commune,
                SUM(e.surface_utile) AS surface_utile,
                SUM(e.potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
            FROM {etablissements_table} e
            GROUP BY code_commune
        ) AS agg
        WHERE {communes_table}.code_commune = agg.code_commune
            AND ({communes_table}.code_commune IN (
                    SELECT arr.insee_arm
                    FROM ST_Read('{arrondissements_path}') arr
            ) OR {communes_table}.code_commune IN ('27676', '75105'))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    sources = extract_sources()
    arrondissements_path = create_arrondissements_geojson()
    etablissements_path = sources["etablissements"].filepath
    communes_path = sources["communes"].filepath

    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Remove arrondissements from communes table
    op.execute(f"""
        DELETE FROM {communes_table}
        WHERE code_commune IN (
            SELECT arr.insee_arm
            FROM ST_Read('{arrondissements_path}') arr
        )
    """)

    # Add back communes for Paris, Lyon and Marseille
    op.execute(f"""
        INSERT INTO {communes_table} (
            code_commune,
            nom_commune,
            code_departement,
            libelle_departement,
            code_region,
            libelle_region,
            surface_utile,
            potentiel_solaire,
            count_etablissements,
            count_etablissements_proteges,
            geom
        )
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
        WHERE com.codgeo IN ('13055', '69123', '75056')     
    """)

    # Add etablissements for TOM (code_region == "00")
    op.execute(f"""
        INSERT INTO {etablissements_table} (
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
            surface_utile,
            potentiel_solaire,
            protection,
            geo_point
        )
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
            code_region = '00'
            AND type_etablissement IN ('Ecole', 'Lycée', 'Collège')
            AND statut_public_prive = 'Public'
            AND etat = 'OUVERT'     
    """)

    # Revert code_commune for new commune Les Trois Lacs
    op.execute(f"""
        UPDATE {communes_table}
        SET code_commune = '27058'
        WHERE code_commune = '27676'
    """)

    # Revert code_commune for Lycée polyvalent Lucas de Nehou ('0750463W')
    op.execute(f"""
        UPDATE {etablissements_table}
        SET code_commune = '75100'
        WHERE identifiant_de_l_etablissement = '0750463W'
    """)
