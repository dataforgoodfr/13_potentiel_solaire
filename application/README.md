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

Les exemples seront données avec `npm` mais d'autres gestionnaire de paquets pourraient être utilisés (`yarn` / `pnpm`).

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

Pour lancer le serveur de dev :

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
