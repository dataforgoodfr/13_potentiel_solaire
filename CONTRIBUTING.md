## Pour commencer
1. [Rejoindre](https://dataforgood.fr/join) la communauté Data For Good
2. Sur le slack Data For Good, rejoindre le canal _#13_potentiel_solaire_ et se présenter
3. Remplir le [formulaire](https://noco.services.dataforgood.fr/dashboard/#/nc/form/46390c65-2886-4852-9db3-327fa0c3ed59)
4. Demander un accès en écriture si je souhaite proposer une modification du code

## Après avoir été affecté à une tâche
1. Cloner le projet en local :
```bash
    git clone https://github.com/dataforgoodfr/13_potentiel_solaire.git
```
2. Si ca fait un moment que le projet a été cloné, s'assurer d'être à jour avec le code :
```bash
    git checkout main
    git pull origin main
```
3. Créer une branche avec un nom qui facilitera le lien avec une tâche du projet :
```bash
    git checkout -b <branch-name>
```
Pour le nom de la branche :
- si c'est une évolution du code : feature/<titre_de_la_fonctionnalite>
- si c'est pour corriger un bug : fix/<titre_du_bug>

## Pendant la réalisation de la tâche
1. Essayer d'avoir des messages de commit le plus clairs possibles :
```bash
    git add script_modifie.py
    git commit -m "<description de la modification>"
```
2. Ne jamais commit directement sur main !

## Une fois la tâche terminée
1. Push sa branche :
```bash
    git push -u origin <branch-name>
```
2. Créer une pull request sur [github](https://github.com/dataforgoodfr/13_potentiel_solaire/compare)
3. Demander une review et une validation de la PR pour qu'elle soit merge sur main
4. Une liste de verifications pour faciliter la validation est disponible dans ce [template](.github/pull_request_template.md)
