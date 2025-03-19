from logging.config import fileConfig
from dataclasses import dataclass
from pathlib import Path

from sqlalchemy import create_engine, MetaData

from alembic import context
from alembic.ddl.impl import DefaultImpl

from potentiel_solaire.constants import DUCK_DB_PATH

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


@dataclass
class Database:
    dialect: str = "duckdb"
    path: Path = DUCK_DB_PATH

    @property
    def url(self):
        return f"{self.dialect}:///{self.path}"

    @property
    def engine(self):
        return create_engine(self.url)

    @property
    def metadata(self):
        return MetaData(schema="potentiel_solaire")


class AlembicDuckDBImpl(DefaultImpl):
    """Alembic implementation for DuckDB."""

    __dialect__ = "duckdb"


def run_migrations_online() -> None:
    """Run migration directly on given dataset"""
    database = Database()

    with database.engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=database.metadata,
            compare_type=True,
            dialect_name=database.dialect,
        )

        with context.begin_transaction():
            context.run_migrations()


def run_migrations_offline() -> None:
    """Generate .sql for the migration"""
    database = Database()

    context.configure(
        url=database.url,
        target_metadata=database.metadata,
        dialect_name=database.dialect,
    )

    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
