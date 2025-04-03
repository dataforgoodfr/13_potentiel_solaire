# Use a specific version of Alpine for stability
# TODO: use lighter image
# FROM node:18 AS base
FROM debian:bookworm-slim

# Set working directory
WORKDIR /app

# Install curl and dependencies
RUN apt-get update && apt-get install -y curl unzip \
    && rm -rf /var/lib/apt/lists/*

# Install DuckDB
RUN curl -L -O https://github.com/duckdb/duckdb/releases/download/v1.2.1/duckdb_cli-linux-amd64.zip \
    && unzip duckdb_cli-linux-amd64.zip -d /usr/local/bin \
    && rm duckdb_cli-linux-amd64.zip

# Create output directory for database and generated files
RUN mkdir -p /app/output/db
RUN mkdir -p /app/output/geojson

# Set working directory to /app/database for executing SQL scripts
WORKDIR /app/database/input

RUN curl -L https://www.data.gouv.fr/fr/datasets/r/d993e112-848f-4446-b93b-0a9d5997c4a4 -o a-reg2021.json
RUN curl -L https://www.data.gouv.fr/fr/datasets/r/92f37c92-3aae-452c-8af1-c77e6dd590e5 -o a-dep2021.json
RUN curl -L https://www.data.gouv.fr/fr/datasets/r/fb3580f6-e875-408d-809a-ad22fc418581 -o a-com2022.json
RUN curl -L https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson?lang=fr -o fr-en-annuaire-education.geojson

WORKDIR /app/database
# Copy the database folder into the container
COPY prepare-JDD-test.sql export-geojson.sql .

# Always execute SQL scripts (no layer cache) and store the generated database/files in /app/output
RUN echo "Force cache busting at $(date)" &&  sh -c "duckdb < prepare-JDD-test.sql /app/output/db/data.duckdb && duckdb /app/output/db/data.duckdb < export-geojson.sql"

CMD ["ls", "-l", "/app/output"]
