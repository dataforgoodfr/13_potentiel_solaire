"""add attributes to etablissements table

Revision ID: feec43549927
Revises: ead6345a90bc
Create Date: 2025-03-31 21:52:20.388896

"""
from typing import Sequence, Union

from alembic import op

from potentiel_solaire.sources.extract import extract_sources


# revision identifiers, used by Alembic.
revision: str = 'feec43549927'
down_revision: Union[str, None] = 'ead6345a90bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# schema
etablissements_table = "etablissements"
communes_table = "communes"
new_columns = {
    "nb_eleves": "INTEGER",
    "adresse_1": "VARCHAR",
    "adresse_2": "VARCHAR",
    "adresse_3": "VARCHAR",
    "code_postal": "STRING",
    "date_calcul": "TIMESTAMP",
    "version": "STRING",
    "nb_batiments_associes": "INTEGER",
}


def upgrade() -> None:
    """Upgrade schema."""
    sources = extract_sources()
    etablissements_path = sources["etablissements"].filepath

    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Ajout des colonnes pour les attributs supplémentaires
    for column_name, column_type in new_columns.items():
        op.execute(f"""
            ALTER TABLE {etablissements_table}
            ADD COLUMN IF NOT EXISTS {column_name} {column_type}
        """)

    # Update avec le fichier d'établissements
    # On supprime les doublons en suivant la logique de la migration précédente
    op.execute(f"""
        UPDATE {etablissements_table}
        SET
            nb_eleves = annuaire.nombre_d_eleves,
            adresse_1 = annuaire.adresse_1,
            adresse_2 = annuaire.adresse_2,
            adresse_3 = annuaire.adresse_3,
            code_postal = annuaire.code_postal
        FROM (
            SELECT e.identifiant_de_l_etablissement,
                   e.nombre_d_eleves,
                   e.adresse_1,
                   e.adresse_2,
                   e.adresse_3,
                   e.code_postal,
                   e.nom_commune = c.nom_commune AS nom_commune_matched,
                   ROW_NUMBER() OVER (PARTITION BY e.identifiant_de_l_etablissement ORDER BY e.identifiant_de_l_etablissement, nom_commune_matched DESC) AS row_number
            FROM ST_Read('{etablissements_path}') e
            LEFT JOIN {communes_table} c ON e.code_commune = c.code_commune
        ) AS annuaire
        WHERE etablissements.identifiant_de_l_etablissement = annuaire.identifiant_de_l_etablissement
            AND annuaire.row_number = 1
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Suppression des colonnes pour les attributs supplémentaires
    for column_name in new_columns.keys():
        op.execute(f"""
            ALTER TABLE {etablissements_table}
            DROP COLUMN IF EXISTS {column_name}
        """)
