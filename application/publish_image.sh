#!/bin/bash

# Get parent directory of this script
APPLICATION_DIR=$(dirname "$(readlink -f "$0")")

# Move to the application directory
cd "$APPLICATION_DIR" || exit 1

# Image name
IMAGE_NAME="ghcr.io/dataforgoodfr/13_potentiel_solaire_app"

# Build docker image
docker build \
    -t $IMAGE_NAME:latest \
	--build-arg DATABASE_PATH=/app/database/data.duckdb \
	-f $APPLICATION_DIR/Dockerfile .

# Check if the previous command was successful
if [ $? -ne 0 ]; then
    echo "Docker build failed."
    exit 1
else
    echo "Docker build succeeded."

    # Créer un token personnel sur son compte github, avec comme droit : write:packages
    # cf https://docs.github.com/fr/packages/working-with-a-github-packages-registry/working-with-the-container-registry
    docker login ghcr.io -u USERNAME -p $GHCR_TOKEN

    # Push the image to GitHub Container Registry
    docker push $IMAGE_NAME --all-tags
fi
