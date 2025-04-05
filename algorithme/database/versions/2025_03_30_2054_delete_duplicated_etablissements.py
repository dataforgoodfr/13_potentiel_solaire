"""delete duplicated etablissements

Revision ID: 9cdde941f829
Revises: 6ae9d430a286
Create Date: 2025-03-30 20:54:54.246291

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '9cdde941f829'
down_revision: Union[str, None] = '6ae9d430a286'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# 53 lignes dans la table etablissements correspondent a 26 etablissements uniques (27 lignes à supprimer)
# Une analyse rapide a montree que pour determiner quels etablissements garder
# On peut essayer de se baser sur le nom de la commune qui semble pas bien renseigne dans ces cas
# Ca reste tout de meme plutot arbitraire

# schema
etablissements_table = "etablissements"
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)
    
    op.execute(f"""          
        ALTER TABLE {etablissements_table}
        ADD COLUMN IF NOT EXISTS row_number INTEGER;
        
        UPDATE {etablissements_table}
        SET
            row_number = subquery.row_number
        FROM (
            SELECT 
                e.identifiant_de_l_etablissement,
                e.nom_commune = c.nom_commune AS nom_commune_matched,
                ROW_NUMBER() OVER (PARTITION BY e.identifiant_de_l_etablissement ORDER BY e.identifiant_de_l_etablissement, nom_commune_matched DESC) AS row_number
            FROM {etablissements_table} e
            LEFT JOIN {communes_table} c ON e.code_commune = c.code_commune
        ) AS subquery
        WHERE {etablissements_table}.identifiant_de_l_etablissement = subquery.identifiant_de_l_etablissement;

        DELETE FROM {etablissements_table}
        WHERE row_number > 1;

        ALTER TABLE {etablissements_table}
        DROP COLUMN IF EXISTS row_number;
    """)

    # update solar potential for communes with previous changes
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
    """)

    # update solar potential for departements with previous changes
    op.execute(f"""
        UPDATE {departements_table}
        SET 
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges
        FROM (
            SELECT 
                e.code_departement,
                SUM(e.surface_utile) AS surface_utile,
                SUM(e.potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
            FROM {etablissements_table} e
            GROUP BY code_departement
        ) AS agg
        WHERE {departements_table}.code_departement = agg.code_departement
    """)

    # update solar potential for regions with previous changes
    op.execute(f"""
        UPDATE {regions_table}
        SET 
            surface_utile = agg.surface_utile,
            potentiel_solaire = agg.potentiel_solaire,
            count_etablissements = agg.count_etablissements,
            count_etablissements_proteges = agg.count_etablissements_proteges
        FROM (
            SELECT 
                e.code_region,
                SUM(e.surface_utile) AS surface_utile,
                SUM(e.potentiel_solaire) AS potentiel_solaire,
                COUNT(*) AS count_etablissements,
                SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges
            FROM {etablissements_table} e
            GROUP BY code_region
        ) AS agg
        WHERE {regions_table}.code_region = agg.code_region
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
