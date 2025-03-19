# Glossaire

- [Technologies](#technologies)
- [Installation](#installation)
- [Développement](#développement)
- [Build](#build)

## Technologies

Ce projet utilise [Next.js](https://nextjs.org) et a été créé avec la commande [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- Typescript et ESLint sont configurés.
- [TailwindCSS](https://tailwindcss.com/) est utilisé.
- Le router App de Next est utilisé ([migrer des pages router vers l'app router](https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration)).

## Installation

### Installation de l'environnement

Cette application nécessite l'environnement [NodeJS](https://nodejs.org/fr) et [npm](https://www.npmjs.com/), vous pouvez les télécharger [ici](https://nodejs.org/fr/download) en suivant les instructions pour votre environnement.

Par exemple sur linux, l'utilitaire `nvm` est conseillé pour gérer les versions de node facilement.

```bash
# Télécharger et installer nvm :
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Télécharger et installer Node.js :
nvm install 22

# Vérifier la version de Node.js :
node -v # Doit afficher "v22.14.0".
nvm current # Doit afficher "v22.14.0".

# Vérifier la version de npm :
npm -v # Doit afficher "10.9.2".

```

Sur windows, l'utilitaire `fnm` est conseillé.

```powershell
# Télécharger et installer fnm :
winget install Schniz.fnm

# Télécharger et installer Node.js :
fnm install 22

# Vérifier la version de Node.js :
node -v # Doit afficher "v22.14.0".

# Vérifier la version de npm :
npm -v # Doit afficher "10.9.2".
```

Pour windows, il faudra ajouter les variables d'environnement pour pouvoir utiliser node après avoir ouvert un nouveau terminal.

```powershell
# Vérifier la version de Node.js :
node -v # Affichera une erreur car Node n'est pas reconnu

fnm env --use-on-cd
# Vérifier la version de Node.js :
node -v # Doit afficher "v22.14.0".
```

Pour éviter d'avoir à jouer cette commande à chaque fois, on peut l'ajouter au fichier de profil du terminal.

> Cela se produit parce que fnm doit modifier votre PATH de manière dynamique lors du changement de version de Node. Définir un PATH statique dans les variables d'environnement de Windows ne suffit pas.

Il existe différentes façon de faire selon le terminal utilisé (voir [shell setup](https://github.com/Schniz/fnm?tab=readme-ov-file#shell-setup)).

La version de `Node` doit être supérieure à la version 18.18 ([version minimum requise](https://nextjs.org/docs/app/getting-started/installation#system-requirements)), il est conseillé d'utiliser une version LTS (Long Term Support).

### Installation des dépendances

Il faut se placer dans le dossier `application` du projet.

```bash
cd application
```

Il faut installer les dépendances du projet grâce au gestionnaire de paquets. Ces dépendances sont listées dans le fichier [package.json](./package.json).

```bash
npm install
```

## Développement

### Installer un éditeur de code

Visual studio code est recommandé pour le développement de l'application.

1. Suivre le processus d'installation sur le site officiel - https://code.visualstudio.com/
2. Installer l'extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

	Modifier les paramètres pour utiliser Prettier comme formatteur par défaut et activer le formattage à la sauvegarde.

	Configuration à placer dans les paramètres `settings.json` :

	```json
	{
		//... autres configurations
		"editor.defaultFormatter": "esbenp.prettier-vscode",
  		"editor.formatOnSave": true,
	}
	```


3. (Conseillé) Installer les autres extensions recommandées pour le projet :	
	- Un linter - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
	- Intégration de règles de formattage standardisé - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
	- Suggestion de code pour Tailwind - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
	- Affichage amélioré des erreurs typescript - [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

### Installer la base de test

Pour initialiser une base duckdb :

En utilisant le CLI :

1. Télécharger le CLI pour son environnement et l'installer - https://duckdb.org/docs/installation/?version=stable&environment=cli

    Pour linux, par exemple :
    `curl https://install.duckdb.org | sh`

	Pour Windows, par exemple :
	`winget install DuckDB.cli`

2. Se rendre dans le répertoire où se trouve le script SQL ({repertoire_projet}/application/database/prepare-JDD-test.sql)

    `cd /database/`

3. Lancer la commande de création de la base

    `duckdb < prepare-JDD-test.sql data-test.duckdb` ou `duckdb -init prepare-JDD-test.sql -no-stdin data-test.duckdb`

En utilisant un éditeur SQL, par exemple DBeaver : https://dbeaver.io/

1. Installer l'outil
2. Créer une connexion duckdb en choisissant l'option pour créer une base et lui fournir un chemin pour la base de données
3. Ouvrir le script sql sur cette nouvelle base de données et l'executer

### Exporter les fichiers geojson

L'application se sert de la base de données mais aussi de fichiers geojson complets qui seront servis de façon statique.

1. Se rendre dans le répertoire où se trouve le script SQL ({repertoire_projet}/application/database/export-geojson.sql)

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

    `duckdb data-test.duckdb < export-geojson.sql`

### Configurer les variables d'environnement

1. Créer un fichier `.env` à partir du fichier `.env.template` (dans le même répertoire).
2. Renseigner les variables manquantes :

`DATABASE_PATH` => le chemin absolu vers la base de donnée duckdb

Ex: `DATABASE_PATH=/path/to/data-test.duckdb`

`NEXT_PUBLIC_BASE_URL` => l'url de déploiement

Ex pour le serveur de dev local : `http://localhost:3000`

### Lancer le serveur

Pour lancer le serveur de dev

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur pour accéder à l'application.

Lorsque vous sauvegarderez des modifications, le serveur redémarrera avec vos modifications.

### Documentation

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) – découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) – un tutoriel interactif sur Next.js.
- [Examples Next.js](https://github.com/vercel/next.js/tree/next-15-0/examples) - Examples de patterns de code avec Next et d'intégration avec d'autres librairies

## Build

Pour compiler l'application en mode production :

```bash
npm run build
```

Le build générera un dossier `.next` contenant les fichiers optimisés pour la production.

Après avoir construit le projet, lancez-le avec :

```bash
npm run start
```
