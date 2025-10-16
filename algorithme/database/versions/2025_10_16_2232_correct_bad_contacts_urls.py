"""correct bad contacts urls

Revision ID: dab03c0a29c7
Revises: 565435221eac
Create Date: 2025-10-16 22:32:09.666428

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'dab03c0a29c7'
down_revision: Union[str, None] = '565435221eac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
annuaire_administration_table = "annuaire_administration"


def upgrade() -> None:
    """Upgrade schema."""
    op.execute(f"""
    UPDATE {annuaire_administration_table}
SET url_contact = NULL
WHERE lower(url_contact) IN ('mairie.', 'mairie');
UPDATE {annuaire_administration_table}
SET url_contact = substr(url_contact, 1, strpos(lower(url_contact), '.fr') + 2)
                 || '/fr/'
                 || substr(url_contact, strpos(lower(url_contact), '.fr') + 5)
WHERE strpos(lower(url_contact), '.fr') > 0
 AND substr(lower(url_contact), strpos(lower(url_contact), '.fr') + 3, 2) = 'fr'
 AND url_contact != 'https://www.fresnes94.fr/contact/';
UPDATE {annuaire_administration_table}
SET url_contact = substr(url_contact, 1, strpos(lower(url_contact), '.fr') + 2)
                 || '/'
                 || substr(url_contact, strpos(lower(url_contact), '.fr') + 3)
WHERE strpos(lower(url_contact), '.fr') > 0
 AND substr(lower(url_contact), strpos(lower(url_contact), '.fr') + 3, 1) NOT IN ('', '/')
 AND substr(lower(url_contact), strpos(lower(url_contact), '.fr') + 3, 2) != 'fr'
 AND url_contact != 'https://www.fresnes94.fr/contact/';
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
