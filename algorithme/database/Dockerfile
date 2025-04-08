FROM debian:bookworm-slim AS exporter

# Set working directory
WORKDIR /app

# Install curl and dependencies
RUN apt-get update && apt-get install -y curl unzip \
    && rm -rf /var/lib/apt/lists/*

# Install DuckDB
RUN curl -L -O https://github.com/duckdb/duckdb/releases/download/v1.2.1/duckdb_cli-linux-amd64.zip \
    && unzip duckdb_cli-linux-amd64.zip -d /usr/local/bin \
    && rm duckdb_cli-linux-amd64.zip

# Copy the database into the container and rename it directory for the database
WORKDIR /app/output/db
COPY potentiel_solaire.duckdb .
RUN mv potentiel_solaire.duckdb data.duckdb

# Export database tables to GeoJSON files
WORKDIR /app/output/geojson
COPY export-geojson.sql .
RUN sh -c "duckdb /app/output/db/data.duckdb < export-geojson.sql" && \
    rm export-geojson.sql

FROM scratch
COPY --from=exporter /app/output/geojson /app/output/geojson
COPY --from=exporter /app/output/db/data.duckdb /app/output/db/data.duckdb
