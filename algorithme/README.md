# Glossaire
- [Installation](#installation)
- [Mettre à jour ou modifier son environnement](#mettre-à-jour-ou-modifier-son-environnement)
- [Recuperer les données](data/README.md)
- [Tester & verifier son code](#tester--verifier-son-code)


# Installation

## 1. Installer Poetry

Plusieurs [méthodes d'installation](https://python-poetry.org/docs/#installation) sont décrites dans la documentation de poetry dont:

- avec pipx
- avec l'installateur officiel

Chaque méthode a ses avantages et inconvénients. Par exemple, la méthode pipx nécessite d'installer pipx au préable, l'installateur officiel utilise curl pour télécharger un script qui doit ensuite être exécuté et comporte des instructions spécifiques pour la completion des commandes poetry selon le shell utilisé (bash, zsh, etc...).

L'avantage de pipx est que l'installation de pipx est documentée pour linux, windows et macos. D'autre part, les outils installées avec pipx bénéficient d'un environment d'exécution isolé, ce qui est permet de fiabiliser leur fonctionnement. Finalement, l'installation de poetry, voire d'autres outils est relativement simple avec pipx.

Cependant, libre à toi d'utiliser la méthode qui te convient le mieux ! Quelque soit la méthode choisie, il est important de ne pas installer poetry dans l'environnement virtuel qui sera créé un peu plus tard dans ce README pour les dépendances de la base de code de ce repo git.

### 1.1 Installation de Poetry avec pipx

Suivre les instructions pour [installer pipx](https://pipx.pypa.io/stable/#install-pipx) selon ta plateforme (linux, windows, etc...)

Par exemple pour Ubuntu 23.04+:

    sudo apt update
    sudo apt install pipx
    pipx ensurepath

[Installer Poetry avec pipx](https://python-poetry.org/docs/#installing-with-pipx):

    pipx install poetry

### 1.2 Installation de Poetry avec l'installateur officiel

L'installation avec l'installateur officiel nécessitant quelques étapes supplémentaires,
se référer à la [documentation officielle](https://python-poetry.org/docs/#installing-with-the-official-installer).

### 1.3 Configurer poetry pour créer les environnements virtuels au sein du projet

    poetry config virtualenvs.in-project true

## 2. Installer les dépendances et le package potentiel_solaire

### 2.1 Naviguer dans le dossier algorithme

    cd algorithme

### 2.2 Installer les dépendances

    poetry install --with dev

### 2.3 Verifier le venv ainsi créé

    poetry env info

### 2.4 Activer l'environnement

    poetry shell

# Modifier les dépendances

### Ajouter une dépendance

    poetry add pandas

### Mettre à jour les dépendances

    poetry update

# Executer les calculs de potentiel solaire

    run-pipeline-algorithme -d 093

# Tester & verifier son code

## Lancer les precommit-hook localement

[Installer les precommit](https://pre-commit.com/)
    
    pre-commit run --all-files

## Utiliser Tox pour tester votre code

    tox -vv
