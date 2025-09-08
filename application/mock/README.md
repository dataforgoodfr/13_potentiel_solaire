# Génération données mockées

## Base de donnée

### Avec docker (recommandé)

    ```sh
    # Depuis le répertoire application du projet :
    cd mock
    # build the docker image
    docker build --platform linux/amd64 -f Dockerfile -t 13_potentiel_solaire_mock_data .
    ```

    Copier les données aux emplacements attendus par l'application

    ```sh
    # revenir d'abord sur le répertoire application
    # cd ../
    docker create --name 13_potentiel_solaire_mock_data_tmp 13_potentiel_solaire_mock_data /bin/true && \
    docker cp 13_potentiel_solaire_mock_data_tmp:/app/output/db/data.duckdb ./database-2 && \
    docker cp 13_potentiel_solaire_mock_data_tmp:/app/output/geojson/. ./public/data-2 && \
    docker rm -f 13_potentiel_solaire_mock_data_tmp
    ```

### Manuellement :

    Pour initialiser une base duckdb :

    En utilisant le CLI :

    1. Télécharger le CLI pour son environnement et l'installer - https://duckdb.org/docs/installation/?version=stable&environment=cli

        Pour linux, par exemple :
        `curl https://install.duckdb.org | sh`

        Pour Windows, par exemple :
        `winget install DuckDB.cli`

    2. Se rendre dans le répertoire où se trouve le script SQL ({repertoire_projet}/application/mock/prepare-JDD-test.sql)

        `cd /mock/`

    3. Lancer la commande de création de la base

        `duckdb < prepare-JDD-test.sql data.duckdb` ou `duckdb -init prepare-JDD-test.sql -no-stdin data.duckdb`

    En utilisant un éditeur SQL, par exemple DBeaver : https://dbeaver.io/

    1. Installer l'outil
    2. Créer une connexion duckdb en choisissant l'option pour créer une base et lui fournir un chemin pour la base de données
    3. Ouvrir le script sql sur cette nouvelle base de données et l'executer

## Exporter les fichiers geojson

L'application se sert de la base de données mais aussi de fichiers geojson complets qui seront servis de façon statique.

### Avec docker (recommandé) :

La commande utilisée pour [Installer la base de test](#avec-docker-recommandé) exporte également les geojson.

### Manuellement :

    1. Se rendre dans le répertoire où se trouve le script SQL ({repertoire_projet}/application/mock/export-geojson.sql)

    2. Décommenter les lignes du fichiers où se situent les commandes `COPY` et remplacer la chemin absolu `/path/to/folder/`.

        Si le {repertoire_projet} se situe à l'emplacement : `/home/my-user/projets/13_potentiel_solaire`, on obtient ainsi :

        ```sql
        COPY (
        SELECT *
        FROM
        	regions
        )
        TO '/home/my-user/projets/13_potentiel_solaire/application/public/data/regions.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Régions');
        ```

    3. Lancer la fichier sql sur la base de données précédemment créée

        `duckdb data.duckdb < export-geojson.sql`
