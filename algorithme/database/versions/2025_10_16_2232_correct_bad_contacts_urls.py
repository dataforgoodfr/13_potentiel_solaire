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
    SET contact_url = contact_url
    """)


def downgrade() -> None:
    """Downgrade schema."""
    pass
