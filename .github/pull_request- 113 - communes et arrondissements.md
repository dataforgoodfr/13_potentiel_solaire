### Description
Github issue : (https://github.com/dataforgoodfr/13_potentiel_solaire/issues/113)

Cette PR a pour objectif de séparer les villes composées d'arrondissement en arrondissement pour assurer un mapping entre les villes et les écoles.

### Comment tester ?
Faire run le code sur un département composé d'arrondissements (eg: "075") et observer qu'il est bien décomposé et que chaque commune a bien une capacité solaire associée.

### Pour faciliter la validation de ma PR
- [ ] J'ai pris connaissance et respecté les [règles de contribution](../CONTRIBUTING.md)
- [ ] Les pre-commit passent
- [ ] Les test unitaires passent
- [ ] Le code modifié fonctionne en local
- [ ] J'ai demandé une peer-review à un autre bénévole du projet
- [ ] J'ai ajouté / mis à jour de la documentation sur [outline](https://outline.services.dataforgood.fr/collection/13_potentiel_scolaire-qJFjGnz5Ec)

### Bonnes pratiques de code
Non obligatoires mais fortement appréciées !

#### Si ca concerne le code de l'agorithme
- Je respecte au mieux la [PEP8](https://peps.python.org/pep-0008/) notamment sur la façon de nommer les classes, fonctions et variables
- Les arguments des fonctions sont typés
- Chaque nouvelle fonction a une docstring
- Je mets à jour les docstrings des fonctions que j'ai modifiée
- J'ai ajouté des commentaires dans le code qui expliquent **pourquoi** certaines opérations sont faites
- Les noms des fonctions & variables aident à la lecture et compréhension du code
- J'évite des fonctions qui prennent en argument des dataframes et renvoient celles-ci modifiées
- J'écrit des tests unitaires pour les fonctions les plus complexes
- Je consulte cette [page](../docs/algorithme_best_code_practices.md) si je veux avoir plus d'explications et d'exemples sur ces bonnes pratiques

#### Si ca concerne le code de l'application web
- Je m'assure que mon code est à jour par rapport à la branche `main` pour tester avec la dernière version du code
- Le linter ne remonte pas d'erreur : `npm run lint`
- J'évite d'utiliser le type `any`
