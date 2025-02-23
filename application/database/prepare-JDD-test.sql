--INSTALL spatial;
LOAD spatial;
--INSTALL httpfs;
LOAD httpfs;

-- Chemin absolu du dossier contenant les fichiers source éventuels (doit finir par le caractère /)
SET VARIABLE path_to_folder = '/path/to/folder/';

-- 1. création des tables depuis les fichiers geojson (la ligne commentée se base sur un fichier local qui sera plus rapide que via https)
-- Dans certains fichiers le code etablissement n'est pas au format 0xx, on utilise donc LPAD à certains endroits pour homogénéiser le format
-- On initialise les propriétés du potentiel_solaire de façon aléatoire :
-- 0 < surface_utile <1000
-- 0 < rayonnement_solaire < 100
-- 0 < potentiel_solaire < 150
-- protection oui/non
-- On initialise le count_etablissements à 0, il est mis à jour dans une requête suivante (pour éviter de créer la colonne à la main)

SET VARIABLE surface_utile_max = 1001;
SET VARIABLE rayonnement_solaire_max = 101;
SET VARIABLE potentiel_solaire_max = 151;

CREATE OR REPLACE TABLE regions AS
    SELECT reg AS code_region,
    libgeo AS libelle_region,
FLOOR(RANDOM() * getvariable('surface_utile_max')) AS surface_utile, 
FLOOR(RANDOM() * getvariable('rayonnement_solaire_max')) AS rayonnement_solaire,
FLOOR(RANDOM() * getvariable('potentiel_solaire_max')) AS potentiel_solaire,
(RANDOM() < 0.5) AS protection,
0 AS count_etablissements,
geom
FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/d993e112-848f-4446-b93b-0a9d5997c4a4') reg;  --16s
-- FROM ST_Read(getvariable('path_to_folder') || 'a-reg2021.json') reg;

CREATE OR REPLACE TABLE departements AS
    SELECT LPAD(dep, 3, '0') AS code_departement,
    libgeo AS libelle_departement,
    reg AS code_region,
    (SELECT libelle_region FROM main.regions r WHERE r.code_region = dept.reg) AS libelle_region,
FLOOR(RANDOM() * getvariable('surface_utile_max')) AS surface_utile, 
FLOOR(RANDOM() * getvariable('rayonnement_solaire_max')) AS rayonnement_solaire,
FLOOR(RANDOM() * getvariable('potentiel_solaire_max')) AS potentiel_solaire,
(RANDOM() < 0.5) AS protection,
0 AS count_etablissements,
    geom
FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/92f37c92-3aae-452c-8af1-c77e6dd590e5') dept;   --40s
-- FROM ST_Read(getvariable('path_to_folder') || 'a-dep2021.json') dept;

CREATE OR REPLACE TABLE communes AS
    SELECT
    codgeo AS code_commune,
    libgeo AS nom_commune,
	LPAD(dep, 3, '0') AS code_departement,
	(SELECT libelle_departement FROM main.departements dept WHERE dept.code_departement = LPAD(com.dep, 3, '0')) AS libelle_departement,
	reg AS code_region,
	(SELECT libelle_region FROM main.regions r WHERE r.code_region = com.reg) AS libelle_region,
	FLOOR(RANDOM() * getvariable('surface_utile_max')) AS surface_utile,
	FLOOR(RANDOM() * getvariable('rayonnement_solaire_max')) AS rayonnement_solaire,
	FLOOR(RANDOM() * getvariable('potentiel_solaire_max')) AS potentiel_solaire,
	(RANDOM() < 0.5) AS protection,
0 AS count_etablissements,
	geom
FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/fb3580f6-e875-408d-809a-ad22fc418581') com; -- ~15 min
-- FROM ST_Read(getvariable('path_to_folder') || 'a-com2022.json') com;


CREATE OR REPLACE TABLE etablissements AS
    SELECT
	identifiant_de_l_etablissement,
	nom_etablissement,
	type_etablissement,
	libelle_nature,
	code_commune,
	nom_commune,
	code_departement,
	libelle_departement,
	code_region,
	libelle_region,
	FLOOR(RANDOM() * getvariable('surface_utile_max')) AS surface_utile,
	FLOOR(RANDOM() * getvariable('rayonnement_solaire_max')) AS rayonnement_solaire,
	FLOOR(RANDOM() * getvariable('potentiel_solaire_max')) AS potentiel_solaire,
	(RANDOM() < 0.5) AS protection,
	geom
FROM ST_Read('https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson?lang=fr') etab; --42s
-- FROM ST_Read(getvariable('path_to_folder') || 'fr-en-annuaire-education.geojson') etab;

-- 2. maj count_etablissements depuis les tables créées
-- certains etablissements ont le meme identifiant, peut etre que le calcul n'est pas correct
--WITH duplicateEtablissements as(
--SELECT identifiant_de_l_etablissement FROM main.etablissements GROUP BY identifiant_de_l_etablissement HAVING count() > 1)
--SELECT e.* FROM duplicateEtablissements INNER JOIN main.etablissements e  ON e.identifiant_de_l_etablissement = duplicateEtablissements.identifiant_de_l_etablissement;

UPDATE main.regions r SET count_etablissements = (SELECT count(*) FROM main.etablissements e WHERE r.code_region = e.code_region);
UPDATE main.departements d SET count_etablissements = (SELECT count(*) FROM main.etablissements e WHERE d.code_departement  = e.code_departement);
UPDATE main.communes c SET count_etablissements = (SELECT count(*) FROM main.etablissements e WHERE c.code_commune = e.code_commune );


-- 3: export geojson (optionnel)	
-- Il faut renseigner le chemin absolu car l'utilisation de variable dans le paramètre COPY..TO n'est pas supporté
--COPY (
--SELECT *
--FROM
--	regions
--) 
--TO '/path/to/folder/regions.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Régions');

--COPY (
--SELECT *
--FROM
--	departements
--) TO '/path/to/folder/departements.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Départements');

--COPY (
--SELECT *
--FROM
--	communes
--) TO '/path/to/folder/communes.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Communes');

--COPY (
--SELECT *
--FROM
--	etablissements
--) TO '/path/to/folder/etablissements.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Etablissements');




