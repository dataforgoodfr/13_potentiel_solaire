# Glossaire
- [Installation](#installation)
    - [Installer Poetry](#11-installer-poetry)
    - [Installer les dépendances et la database](#12-installer-les-dépendances-et-la-database)
- [Calculs de potentiel solaire](#2-calculs-de-potentiel-solaire)
    - [Executer les calculs](#21-executer-les-calculs)
    - [Récupérer les resultats](#22-récupérer-les-resultats)
- [Tester & verifier son code](#tester--verifier-son-code)
    - [Analyser les resultats sur un departement](#31-analyser-les-resultats-sur-un-departement)
    - [Lancer les precommit-hook localement](#32-lancer-les-precommit-hook-localement)
    - [Lancer les tests unitaires](#33-lancer-les-tests-unitaires)
- [Publier les resultats](#4-publier-les-resultats-github-package-registry)
    - [Réaliser les calculs pour tous les établissements scolaires](#41-réaliser-les-calculs-pour-tous-les-établissements-scolaires)
    - [Créer un token github (classic) personnel](#42-créer-un-token-github-classic-personnel)
    - [Exectuer le script de publication de la database](#43-exécuter-le-script-de-publication-de-la-database)


# 1. Installation

## 1.1 Installer Poetry

Plusieurs [méthodes d'installation](https://python-poetry.org/docs/#installation) sont décrites dans la documentation de poetry dont:

- avec pipx
- avec l'installateur officiel

Chaque méthode a ses avantages et inconvénients. Par exemple, la méthode pipx nécessite d'installer pipx au préable, l'installateur officiel utilise curl pour télécharger un script qui doit ensuite être exécuté et comporte des instructions spécifiques pour la completion des commandes poetry selon le shell utilisé (bash, zsh, etc...).

L'avantage de pipx est que l'installation de pipx est documentée pour linux, windows et macos. D'autre part, les outils installées avec pipx bénéficient d'un environment d'exécution isolé, ce qui est permet de fiabiliser leur fonctionnement. Finalement, l'installation de poetry, voire d'autres outils est relativement simple avec pipx.

Cependant, libre à toi d'utiliser la méthode qui te convient le mieux ! Quelque soit la méthode choisie, il est important de ne pas installer poetry dans l'environnement virtuel qui sera créé un peu plus tard dans ce README pour les dépendances de la base de code de ce repo git.

### Installation de Poetry avec pipx

Suivre les instructions pour [installer pipx](https://pipx.pypa.io/stable/#install-pipx) selon ta plateforme (linux, windows, etc...)

Par exemple pour Ubuntu 23.04+:

    sudo apt update
    sudo apt install pipx
    pipx ensurepath

[Installer Poetry avec pipx](https://python-poetry.org/docs/#installing-with-pipx):

    pipx install poetry

### Installation de Poetry avec l'installateur officiel

L'installation avec l'installateur officiel nécessitant quelques étapes supplémentaires,
se référer à la [documentation officielle](https://python-poetry.org/docs/#installing-with-the-official-installer).

### Configurer poetry pour créer les environnements virtuels au sein du projet

    poetry config virtualenvs.in-project true

## 1.2 Installer les dépendances et la database

### Naviguer dans le dossier algorithme

    cd algorithme

### Installer les dépendances

    poetry install --with dev

### Verifier le venv ainsi créé

    poetry env info

### Initialiser la database duckdb

    alembic upgrade head

# 2. Calculs de potentiel solaire

## 2.1 Executer les calculs

* Sur un departement: `poetry run algorithme calculate-for-schools -d 093`

* Sur une region: `poetry run algorithme calculate-for-schools -r 11`

* Sur toute la France: `poetry run algorithme calculate-for-schools --all_departements`

* Mettre à jour les indicateurs dans la database duckdb: `poetry run algorithme update-database-indicators`

* Obtenir les etablissements prioritaires selon les criteres de Greenpeace : `poetry run algorithme save-high-priority-schools`
 
Note : pour executer la pipeline sur toute la France, il faut avoir à minima 180 Go d'espace disponible et compter minimum 10H de temps d'execution.

## 2.2 Récupérer les resultats
* un fichier .gpkg dans le dossier [results](data/results) pour les resultats pour chaque departement (ex: [D093_pipeline_results.gpkg](data/results/D093_pipeline_results.gpkg))
* dans la [database duckdb](database/potentiel_solaire.duckdb)
* un fichier .csv dans le dossier [results](data/results) avec les etablissements prioritaires selon les criteres de Greenpeace

# 3. Tester & verifier son code

## 3.1 Analyser les resultats sur un departement
Le notebook [analyse_qualite_resultats_pipeline.ipynb](notebooks/analyse_qualite_resultats_pipeline.ipynb) permet d'analyser les resulats sur le departement de son choix.

## 3.2 Lancer les precommit-hook localement

[Installer les precommit](https://pre-commit.com/)
    
    poetry run pre-commit run --all-files

## 3.3 Lancer les tests unitaires

    poetry run tox -vv

# 4. Publier les resultats (Github Package Registry)

### Naviguer dans le dossier algorithme

    cd algorithme

## 4.1 Réaliser les calculs pour tous les établissements scolaires 

Il est aussi possible de le faire avec Docker d'installé sans passer par python (cf [2.1](#21-executer-les-calculs)).

### Build l'image docker de l'algorithme :

    docker build -t 13_potentiel_solaire_algo --platform linux/amd64 .

### Initialiser la database duckdb

    docker run --rm \
        --volume ./data:/app/data \
        --volume ./database:/app/database \
        13_potentiel_solaire_algo alembic upgrade head

### Lancement des calculs sur toute la France :

    docker run --rm \
        --volume ./data:/app/data \
        --volume ./database:/app/database \
        13_potentiel_solaire_algo algorithme calculate-for-schools --all_departements

## 4.2 Créer un token github (classic) personnel

Avec comme scope : write:packages.

Plus de détails [ici](https://docs.github.com/fr/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## 4.3 Exécuter le script de publication de la database

    sh publish_algorithme_results.sh
