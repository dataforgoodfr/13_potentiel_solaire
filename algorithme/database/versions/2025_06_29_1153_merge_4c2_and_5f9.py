"""merge 4c2 and 5f9

Revision ID: f33b80454ef2
Revises: 4c2566ff3562, 5153ebff0158
Create Date: 2025-06-29 11:53:08.881408

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = 'f33b80454ef2'
down_revision: Union[str, None] = ('4c2566ff3562', '5153ebff0158')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
