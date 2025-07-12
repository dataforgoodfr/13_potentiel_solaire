#!/bin/bash

# Get parent directory of this script
ALGORITHME_DIR=$(dirname "$(readlink -f "$0")")

# Get the current date
CURRENT_DATE=$(date +%Y%m%d)

# Check if poetry is installed
if command -v poetry; then
    # Get code version using poetry
    ALGORITHME_VERSION=$(poetry version --directory=$ALGORITHME_DIR -s)
else
    read -p "Poetry is not installed. Please enter the version for algorithme stated in pyproject.toml (default: 'latest'): " ALGORITHME_VERSION
    ALGORITHME_VERSION=${ALGORITHME_VERSION:-latest}
fi

echo "Using '$ALGORITHME_VERSION' as the version for algorithme."

# Build Docker image for algorithme
docker build \
    -t 13_potentiel_solaire_algo:$ALGORITHME_VERSION \
    -f $ALGORITHME_DIR/Dockerfile \
    --platform linux/amd64 \
    $ALGORITHME_DIR

# Run Docker container to update database indicators
# This command will fails if the database is not init and calculations done on all schools
docker run --rm \
    --volume $ALGORITHME_DIR/data:/app/data \
    --volume $ALGORITHME_DIR/database:/app/database \
    13_potentiel_solaire_algo:$ALGORITHME_VERSION algorithme update-database-indicators

# Check if the previous command was successful
if [ $? -ne 0 ]; then
    echo "Updating database indicators failed."
    echo "Algorithme results are not ready to be published."
    exit 1
else
    echo "Updating database indicators completed successfully."
    echo "Algorithme results are ready to be published."

    # Créer un token personnel sur son compte github, avec comme droit : write:packages
    # cf https://docs.github.com/fr/packages/working-with-a-github-packages-registry/working-with-the-container-registry
    read -p "Enter your personal access token (github) with write:packages scope: " CR_PAT
    echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

    # Build docker image for database
    docker build \
        -t ghcr.io/dataforgoodfr/13_potentiel_solaire_db:$ALGORITHME_VERSION.$CURRENT_DATE \
        -f $ALGORITHME_DIR/database/Dockerfile \
        $ALGORITHME_DIR/database

    # Push the image to GitHub Container Registry
    docker push ghcr.io/dataforgoodfr/13_potentiel_solaire_db:$ALGORITHME_VERSION.$CURRENT_DATE
fi
