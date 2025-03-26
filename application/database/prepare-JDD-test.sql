INSTALL spatial;
LOAD spatial;
INSTALL httpfs;
LOAD httpfs;

-- Chemin absolu du dossier contenant les fichiers source éventuels (string qui doit finir par le caractère /)
SET VARIABLE path_to_folder = null; -- exemple : '/path/to/folder/'

-- 1. création des tables depuis les fichiers geojson (la ligne commentée se base sur un fichier local qui sera plus rapide que via https)
-- Dans certains fichiers le code etablissement n'est pas au format 0xx, on utilise donc LPAD à certains endroits pour homogénéiser le format
-- On initialise les propriétés du potentiel_solaire des établissements de façon aléatoire :
-- surface_utile : de 0 à 10 000 m²
-- rayonnement_solaire : de 1100 à 1200 kW/m².an (dépend du département, peut aller au delà de 1600)
-- potentiel_solaire : de 0 à 1 000 000 kWh/an
-- protection oui/non
-- Pour les zones aggrégées,
-- On initialise les propriétés surface_utile, potentiel_solaire, count_etablissements et count_etablissements_proteges à 0, il seront mis à jour dans une requête suivante (pour éviter de créer la colonne à la main)

SET VARIABLE surface_utile_min = 0;
SET VARIABLE surface_utile_max = 10000;
SET VARIABLE rayonnement_solaire_min = 1100;
SET VARIABLE rayonnement_solaire_max = 1600;
SET VARIABLE potentiel_solaire_min = 0;
SET VARIABLE potentiel_solaire_max = 1000000;

CREATE OR REPLACE TABLE regions AS
    SELECT reg AS code_region,
    libgeo AS libelle_region,
	0 AS surface_utile,
	0::BIGINT AS potentiel_solaire,
	0 AS count_etablissements,
	0 AS count_etablissements_proteges,
	geom
	FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/d993e112-848f-4446-b93b-0a9d5997c4a4') reg;  --16s
-- FROM ST_Read(getvariable('path_to_folder') || 'a-reg2021.json') reg;

CREATE OR REPLACE TABLE departements AS
    SELECT LPAD(dep, 3, '0') AS code_departement,
    libgeo AS libelle_departement,
    reg AS code_region,
    (SELECT libelle_region FROM regions r WHERE r.code_region = dept.reg) AS libelle_region,
	0 AS surface_utile,
	0::BIGINT AS potentiel_solaire,
	0 AS count_etablissements,
	0 AS count_etablissements_proteges,
    geom
	FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/92f37c92-3aae-452c-8af1-c77e6dd590e5') dept;   --40s
-- FROM ST_Read(getvariable('path_to_folder') || 'a-dep2021.json') dept;

CREATE OR REPLACE TABLE communes AS
    SELECT
    codgeo AS code_commune,
    libgeo AS nom_commune,
	LPAD(dep, 3, '0') AS code_departement,
	(SELECT libelle_departement FROM departements dept WHERE dept.code_departement = LPAD(com.dep, 3, '0')) AS libelle_departement,
	reg AS code_region,
	(SELECT libelle_region FROM regions r WHERE r.code_region = com.reg) AS libelle_region,
	0 AS surface_utile,
	0::BIGINT AS potentiel_solaire,
	0 AS count_etablissements,
	0 AS count_etablissements_proteges,
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
	FLOOR(RANDOM() * (getvariable('surface_utile_max') - getvariable('surface_utile_min') + 1)) + getvariable('surface_utile_min') AS surface_utile,
	FLOOR(RANDOM() * (getvariable('rayonnement_solaire_max') - getvariable('rayonnement_solaire_min') + 1)) + getvariable('rayonnement_solaire_min') AS rayonnement_solaire,
	FLOOR(RANDOM() * (getvariable('potentiel_solaire_max') - getvariable('potentiel_solaire_min') + 1)) + getvariable('potentiel_solaire_min') AS potentiel_solaire,
	(RANDOM() < 0.5) AS protection,
	geom
	FROM ST_Read('https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson?lang=fr') etab; --42s
-- FROM ST_Read(getvariable('path_to_folder') || 'fr-en-annuaire-education.geojson') etab;

-- 2. maj count_etablissements, count_etablissements_proteges, surface_utile, potentiel_solaire depuis les tables créées
-- certains etablissements ont le meme identifiant, peut etre que le calcul n'est pas correct
--WITH duplicateEtablissements as(
--SELECT identifiant_de_l_etablissement FROM etablissements GROUP BY identifiant_de_l_etablissement HAVING count() > 1)
--SELECT e.* FROM duplicateEtablissements INNER JOIN etablissements e  ON e.identifiant_de_l_etablissement = duplicateEtablissements.identifiant_de_l_etablissement;

-- maj regions
UPDATE regions r
SET count_etablissements = regionEtablissements.count_etablissements,
count_etablissements_proteges = regionEtablissements.count_etablissements_proteges,
surface_utile = regionEtablissements.surface_utile,
potentiel_solaire = regionEtablissements.potentiel_solaire
FROM (
    SELECT e.code_region,
	COUNT(*) AS count_etablissements,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
	SUM(e.surface_utile) AS surface_utile,
	SUM(e.potentiel_solaire) AS potentiel_solaire
    FROM etablissements e
    GROUP BY e.code_region
) AS regionEtablissements
WHERE r.code_region = regionEtablissements.code_region;

-- maj departements
UPDATE departements d
SET count_etablissements = departementEtablissements.count_etablissements,
count_etablissements_proteges = departementEtablissements.count_etablissements_proteges,
surface_utile = departementEtablissements.surface_utile,
potentiel_solaire = departementEtablissements.potentiel_solaire
FROM (
	SELECT e.code_departement,
	COUNT(*) AS count_etablissements,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
	SUM(e.surface_utile) AS surface_utile,
	SUM(e.potentiel_solaire) AS potentiel_solaire
	FROM etablissements e
	GROUP BY e.code_departement
) AS departementEtablissements
WHERE d.code_departement = departementEtablissements.code_departement;

-- maj communes
UPDATE communes c
SET count_etablissements = communeEtablissements.count_etablissements,
count_etablissements_proteges = communeEtablissements.count_etablissements_proteges,
surface_utile = communeEtablissements.surface_utile,
potentiel_solaire = communeEtablissements.potentiel_solaire
FROM (
	SELECT e.code_commune,
	COUNT(*) AS count_etablissements,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS count_etablissements_proteges,
	SUM(e.surface_utile) AS surface_utile,
	SUM(e.potentiel_solaire) AS potentiel_solaire
	FROM etablissements e
	GROUP BY e.code_commune
) AS communeEtablissements
WHERE c.code_commune = communeEtablissements.code_commune;

-- create materialized view with a common libelle column on every tables
-- On nettoie le libellé dans la colonne sanitized_libelle :
-- 1. suppression des accents
-- 2. remplacement de la ponctuation par des espaces
-- 3. suppression des doublons d'espaces
-- 4. conversion en lowercase.
-- TODO: add code_postal in etablissement extra_data
CREATE OR REPLACE TABLE search_view AS 
SELECT 
'etablissements' AS source_table, 
identifiant_de_l_etablissement as id, 
nom_etablissement AS libelle, 
lower(regexp_replace(regexp_replace(strip_accents(nom_etablissement), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle, 
to_json(struct_pack(nom_commune)) AS extra_data 
FROM etablissements
UNION ALL
SELECT 
'communes' AS source_table, 
code_commune AS id, 
nom_commune AS libelle, 
lower(regexp_replace(regexp_replace(strip_accents(nom_commune), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle, 
NULL::json AS extra_data 
FROM communes
UNION ALL
SELECT 
'departements' AS source_table,
code_departement AS id,
libelle_departement AS libelle,
lower(regexp_replace(regexp_replace(strip_accents(libelle_departement), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle,
NULL::json AS extra_data 
FROM departements
UNION ALL
SELECT 
'regions' AS source_table,
code_region AS id,
libelle_region AS libelle,
lower(regexp_replace(regexp_replace(strip_accents(libelle_region), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle,
NULL::json AS extra_data 
FROM regions;
