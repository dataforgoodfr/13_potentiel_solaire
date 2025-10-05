"""add administration contacts db

Revision ID: 565435221eac
Revises: bc9fa1bdc77c
Create Date: 2025-10-05 11:33:17.222557

"""
from typing import Sequence, Union

from alembic import op
from potentiel_solaire.sources.extract import extract_sources


# revision identifiers, used by Alembic.
revision: str = '565435221eac'
down_revision: Union[str, None] = 'bc9fa1bdc77c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
annuaire_administration_table = "annuaire_administration"


def upgrade() -> None:
    """Upgrade schema."""
    # extract sources
    sources = extract_sources()
    annuaire_administration_path = sources["annuaire_administration"].filepath

    # load into new table
    op.execute(f"""
    CREATE TABLE IF NOT EXISTS {annuaire_administration_table} AS
        -- Recuperation et transformation des infos de contact par commune
WITH annuaire_raw AS (
    SELECT codeinsee as code_commune,
        nom,
        coordonneesnum_email,
        coordonneesnum_url,
        datemiseajour
    FROM  read_parquet('{annuaire_administration_path}')
),

-- Extraction des arrondissements pour Marseille - chaque adresse est associé à 2 arrondissement
annuaire_marseille_expanded AS (
    SELECT
        *,
        regexp_extract_all(lower(nom), '([0-9]{{1,2}})(?\:er|e)?', 1) AS arr_numbers
    FROM annuaire_raw
    WHERE code_commune LIKE '132%'
),

-- Duplication des lignes Marseille par arrondissement
annuaire_marseille_dup AS (
    SELECT 
        *,
        unnest(arr_numbers) AS arr_num
    FROM annuaire_marseille_expanded
),

-- Reconstitution des lignes avec bon code commune pour Marseille
annuaire_marseille_recode AS (
    SELECT 
       printf('132%02d', arr_num::int) AS code_commune,
        nom,
        coordonneesnum_email,
        coordonneesnum_url,
        datemiseajour
    FROM annuaire_marseille_dup
),

-- Union Marseille + autres
annuaire_all AS (
    SELECT * FROM annuaire_marseille_recode
    UNION ALL
    SELECT * FROM annuaire_raw
    WHERE code_commune NOT LIKE '132%'
),

-- Nettoyage : on garde que les non-déléguées et la plus récente
annuaire_clean AS (
    SELECT DISTINCT ON (code_commune)
        code_commune,
        nom,
        coordonneesnum_email,
        coordonneesnum_url
    FROM annuaire_all
    WHERE lower(nom) NOT LIKE '%déléguée%'
    QUALIFY ROW_NUMBER() OVER (PARTITION BY code_commune ORDER BY datemiseajour DESC) = 1
)

-- Sélection finale
SELECT
    communes.code_commune,
    communes.nom_commune,
    if(annuaire_clean.coordonneesnum_email LIKE '%@%',annuaire_clean.coordonneesnum_email, NULL) AS email,
    if(annuaire_clean.coordonneesnum_email NOT LIKE '%@%',annuaire_clean.coordonneesnum_email,NULL) AS url_contact,
    annuaire_clean.coordonneesnum_url AS url_site_mairie
FROM main.communes as communes
LEFT JOIN annuaire_clean USING (code_commune)
ORDER BY communes.code_commune
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table(annuaire_administration_table, if_exists=True)
