"""add indicators for app fiches zone

Revision ID: b80cbbbf68d9
Revises: 49d44d790ee6
Create Date: 2025-04-05 14:57:19.102683

"""
from dataclasses import dataclass
from typing import Optional, Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b80cbbbf68d9'
down_revision: Union[str, None] = '49d44d790ee6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# schema
etablissements_table = "etablissements"
communes_table = "communes"
departements_table = "departements"
regions_table = "regions"
seuils_niveaux_potentiels_table = "seuils_niveaux_potentiels"


@dataclass
class Aggregation:
    table: str
    suffix: str = ""

@dataclass
class Indicator:
    name: str
    data_type: str
    default_value: Optional[str] = None

@dataclass
class ZoneAggregationIndicator:
    aggregation: Aggregation
    indicator: Indicator

    @property
    def table_name(self) -> str:
        return self.aggregation.table
    
    @property
    def column_name(self) -> str:
        return f"{self.indicator.name}{self.aggregation.suffix}"
    
    @property
    def column_type(self) -> str:
        return f"{self.indicator.data_type} DEFAULT {self.indicator.default_value}" if self.indicator.default_value else self.indicator.data_type


# aggregations to add
new_aggregations = [
    Aggregation(table=communes_table, suffix="_primaires"),
    Aggregation(table=communes_table, suffix="_total"),
    Aggregation(table=departements_table, suffix="_colleges"),
    Aggregation(table=departements_table, suffix="_total"),
    Aggregation(table=regions_table, suffix="_lycees"),
    Aggregation(table=regions_table, suffix="_total"),
]

additional_aggregations_for_potentiel_solaire = [
    Aggregation(table=communes_table, suffix="_colleges"),
    Aggregation(table=communes_table, suffix="_lycees"),
    Aggregation(table=departements_table, suffix="_primaires"),
    Aggregation(table=departements_table, suffix="_lycees"),
    Aggregation(table=regions_table, suffix="_primaires"),
    Aggregation(table=regions_table, suffix="_colleges"),   
]
    

# indicators to add
new_indicators = [
    Indicator(name="nb_eleves", data_type="INTEGER", default_value="0"),
    Indicator(name="nb_etablissements", data_type="INTEGER", default_value="0"),
    Indicator(name="nb_etablissements_proteges", data_type="INTEGER", default_value="0"),
    Indicator(name="surface_exploitable_max", data_type="INTEGER", default_value="0"),
    Indicator(name="potentiel_solaire", data_type="BIGINT", default_value="0"),
    Indicator(name="potentiel_nb_foyers", data_type="INTEGER", default_value="0"),
    Indicator(name="top_etablissements", data_type="JSON", default_value="'[]'"),
    Indicator(name="nb_etablissements_par_niveau_potentiel", data_type="JSON", default_value="'{\"1_HIGH\": 0,\"2_GOOD\": 0,\"3_LIMITED\": 0}'"),
]


# new indicators x aggregations to add
new_zone_aggregation_indicators = [
    ZoneAggregationIndicator(
        aggregation=aggregation,
        indicator=indicator
    )
    for aggregation in new_aggregations
    for indicator in new_indicators
]

potentiel_solaire_indicator = Indicator(name="potentiel_solaire", data_type="BIGINT", default_value="0")
for aggregation in additional_aggregations_for_potentiel_solaire:
    new_zone_aggregation_indicators.append(
        ZoneAggregationIndicator(
            aggregation=aggregation,
            indicator=potentiel_solaire_indicator
        )
    )


# indicators to delete
deleted_indicators = [
    Indicator(name="surface_utile", data_type="INTEGER", default_value="0"),
    Indicator(name="potentiel_solaire", data_type="BIGINT", default_value="0"),
    Indicator(name="count_etablissements", data_type="INTEGER", default_value="0"),
    Indicator(name="count_etablissements_proteges", data_type="INTEGER", default_value="0"),
]

# aggregations to delete
deleted_aggregations = [
    Aggregation(table=communes_table),
    Aggregation(table=departements_table),
    Aggregation(table=regions_table),
]

# deleted indicators x aggregations to delete
deleted_zone_aggregation_indicators = [
    ZoneAggregationIndicator(
        aggregation=aggregation,
        indicator=indicator
    )
    for aggregation in deleted_aggregations
    for indicator in deleted_indicators
]


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Rename column for surface_utile in etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN surface_utile TO surface_exploitable_max
    """)

    # Create table with min values for each niveau_potentiel
    op.execute(f"""
        CREATE TABLE IF NOT EXISTS {seuils_niveaux_potentiels_table} (
            niveau_potentiel VARCHAR UNIQUE NOT NULL,
            min_potentiel_solaire BIGINT NOT NULL,
            max_potentiel_solaire BIGINT NOT NULL,
        )
    """)

    # Insert values into seuils_niveaux_potentiels table
    op.execute(f"""
        INSERT INTO {seuils_niveaux_potentiels_table} 
            (niveau_potentiel, min_potentiel_solaire, max_potentiel_solaire)
        VALUES
            ('1_HIGH', 250000, 999999999999),
            ('2_GOOD', 100000, 249999), 
            ('3_LIMITED', 0, 99999)
    """)

    # Add niveau_potentiel column to etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        ADD COLUMN IF NOT EXISTS niveau_potentiel VARCHAR DEFAULT '3_LIMITED'
    """)

    # Add potentiel_solaire column to etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        ADD COLUMN IF NOT EXISTS potentiel_nb_foyers INTEGER DEFAULT 0
    """)

    # Add new columns to each table
    for zone_agg_ind in new_zone_aggregation_indicators:
        op.execute(f"""
            ALTER TABLE {zone_agg_ind.table_name}
            ADD COLUMN IF NOT EXISTS {zone_agg_ind.column_name} {zone_agg_ind.column_type}
        """)

    # Remove columns for each table
    for zone_agg_ind in deleted_zone_aggregation_indicators:
        op.execute(f"""
            ALTER TABLE {zone_agg_ind.table_name}
            DROP COLUMN IF EXISTS {zone_agg_ind.column_name}
        """)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        INSTALL spatial;
        LOAD spatial;
    """)

    # Add new columns to each table
    for zone_agg_ind in deleted_zone_aggregation_indicators:
        op.execute(f"""
            ALTER TABLE {zone_agg_ind.table_name}
            ADD COLUMN IF NOT EXISTS {zone_agg_ind.column_name} {zone_agg_ind.column_type}
        """)

    # Remove columns for each table
    for zone_agg_ind in new_zone_aggregation_indicators:
        op.execute(f"""
            ALTER TABLE {zone_agg_ind.table_name}
            DROP COLUMN IF EXISTS {zone_agg_ind.column_name}
        """)

    # Remove potentiel_nb_foyers column from etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        DROP COLUMN IF EXISTS potentiel_nb_foyers
    """)

    # Remove niveau_potentiel column from etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        DROP COLUMN IF EXISTS niveau_potentiel
    """)

    # Remove seuils_niveaux_potentiels table
    op.execute(f"""
        DROP TABLE IF EXISTS {seuils_niveaux_potentiels_table}
    """)
    
    # Rename column for surface_exploitable_max in etablissements table
    op.execute(f"""
        ALTER TABLE {etablissements_table}
        RENAME COLUMN surface_exploitable_max TO surface_utile
    """)
