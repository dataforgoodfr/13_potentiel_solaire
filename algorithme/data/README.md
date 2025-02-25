## Recuperation des données brutes

Etre dans le dossier algorithme

    cd algorithme

Installer les dépendances & activer l'environnement

    poetry install
    poetry shell

Lancer le script de recuperation

    extract-sample-data

Une fois ce script réussi, les données dézippées devraient être visibles dans ce dossier data.


## Espace à prévoir

Dossiers

```shell
1,6G	../data/BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15
206M	../data/PARCELLAIRE-EXPRESS_1-1__SHP_LAMB93_D093_2024-10-01
2,6G	../data/MNS-Correl_1-0__TIFF_LAMB93_D093_2024-01-01
```

et les fichiers

```shell
244M BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15.7z
165M BDTOPO_3-4_TOUSTHEMES_SHP_LAMB93_D093_2024-12-15.7z
3,3M contour-des-departements.geojson
627M ENR_1-0_POT-SOL-SOL_GPKG_LAMB93_FXX_2024-04-01.7z
141M fr-en-annuaire-education.geojson
 39M PARCELLAIRE-EXPRESS_1-1__SHP_LAMB93_D093_2024-10-01.7z
788M potentiel-gisement-solaire-brut-au-bati.geojson
424M potentiel-gisement-solaire-brut-au-bati.gpkg
2,1G potentiel-solaire.geojson
1,1G potentiel-solaire.gpkg
3,2M saint_denis_reference_data.gpkg
```