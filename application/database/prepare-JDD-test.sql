INSTALL spatial;
LOAD spatial;
INSTALL httpfs;
LOAD httpfs;

-- Chemin absolu du dossier contenant les fichiers source éventuels (string qui doit finir par le caractère /)
SET VARIABLE path_to_folder = '/app/database/input/'; -- exemple : '/path/to/folder/'

-- 1. création des tables depuis les fichiers geojson (la ligne commentée se base sur un fichier local qui sera plus rapide que via https)
-- Dans certains fichiers le code etablissement n'est pas au format 0xx, on utilise donc LPAD à certains endroits pour homogénéiser le format
-- On initialise les propriétés du potentiel_solaire des établissements de façon aléatoire :
-- surface_exploitable : de 0 à 10 000 m²
-- potentiel_solaire : de 0 à 1 000 000 kWh/an
-- protection oui/non
-- Pour les zones aggrégées,
-- On initialise les propriétés avec des valeurs nulles, elles seront mises à jour dans une requête suivante (pour éviter de créer la colonne à la main)

SET VARIABLE surface_exploitable_min = 0;
SET VARIABLE surface_exploitable_max = 10000;
SET VARIABLE potentiel_solaire_min = 0;
SET VARIABLE potentiel_solaire_max = 1000000;
SET VARIABLE nb_eleves_min = 45;
SET VARIABLE nb_eleves_max = 500;

CREATE OR REPLACE TABLE regions AS
    SELECT reg AS code_region,
    libgeo AS libelle_region,
	0 AS nb_eleves_total,
	0 AS nb_eleves_lycees,
	0 AS nb_etablissements_total,
	0 AS nb_etablissements_lycees,
	0 AS nb_etablissements_proteges_total,
	0 AS nb_etablissements_proteges_lycees,
	0 AS surface_exploitable_max_total,
	0 AS surface_exploitable_max_lycees,
	0::BIGINT AS potentiel_solaire_total,
	0::BIGINT AS potentiel_solaire_lycees,
	0::BIGINT AS potentiel_solaire_colleges,
	0::BIGINT AS potentiel_solaire_primaires,
	0::BIGINT AS potentiel_nb_foyers_total,
	0::BIGINT AS potentiel_nb_foyers_lycees,
	NULL::JSON AS top_etablissements_total,
	NULL::JSON AS top_etablissements_lycees,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_total,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_lycees,
	geom
	FROM ST_Read(getvariable('path_to_folder') || 'a-reg2021.json') reg;
	-- FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/d993e112-848f-4446-b93b-0a9d5997c4a4') reg;  --16s

CREATE OR REPLACE TABLE departements AS
    SELECT LPAD(dep, 3, '0') AS code_departement,
    libgeo AS libelle_departement,
    reg AS code_region,
    (SELECT libelle_region FROM regions r WHERE r.code_region = dept.reg) AS libelle_region,
	0 AS nb_eleves_total,
	0 AS nb_eleves_colleges,
	0 AS nb_etablissements_total,
	0 AS nb_etablissements_colleges,
	0 AS nb_etablissements_proteges_total,
	0 AS nb_etablissements_proteges_colleges,
	0 AS surface_exploitable_max_total,
	0 AS surface_exploitable_max_colleges,
	0::BIGINT AS potentiel_solaire_total,
	0::BIGINT AS potentiel_solaire_lycees,
	0::BIGINT AS potentiel_solaire_colleges,
	0::BIGINT AS potentiel_solaire_primaires,
	0::BIGINT AS potentiel_nb_foyers_total,
	0::BIGINT AS potentiel_nb_foyers_colleges,
	NULL::JSON AS top_etablissements_total,
	NULL::JSON AS top_etablissements_colleges,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_total,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_colleges,
    geom
	FROM ST_Read(getvariable('path_to_folder') || 'a-dep2021.json') dept;
	-- FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/92f37c92-3aae-452c-8af1-c77e6dd590e5') dept;   --40s

CREATE OR REPLACE TABLE communes AS
    SELECT
    codgeo AS code_commune,
    libgeo AS nom_commune,
	LPAD(dep, 3, '0') AS code_departement,
	(SELECT libelle_departement FROM departements dept WHERE dept.code_departement = LPAD(com.dep, 3, '0')) AS libelle_departement,
	reg AS code_region,
	(SELECT libelle_region FROM regions r WHERE r.code_region = com.reg) AS libelle_region,
	0 AS nb_eleves_total,
	0 AS nb_eleves_primaires,
	0 AS nb_etablissements_total,
	0 AS nb_etablissements_primaires,
	0 AS nb_etablissements_proteges_total,
	0 AS nb_etablissements_proteges_primaires,
	0 AS surface_exploitable_max_total,
	0 AS surface_exploitable_max_primaires,
	0::BIGINT AS potentiel_solaire_total,
	0::BIGINT AS potentiel_solaire_lycees,
	0::BIGINT AS potentiel_solaire_colleges,
	0::BIGINT AS potentiel_solaire_primaires,
	0::BIGINT AS potentiel_nb_foyers_total,
	0::BIGINT AS potentiel_nb_foyers_primaires,
	NULL::JSON AS top_etablissements_total,
	NULL::JSON AS top_etablissements_primaires,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_total,
	NULL::JSON AS nb_etablissements_par_niveau_potentiel_primaires,
	geom
	FROM ST_Read(getvariable('path_to_folder') || 'a-com2022.json') com;
	-- FROM ST_Read('https://www.data.gouv.fr/fr/datasets/r/fb3580f6-e875-408d-809a-ad22fc418581') com; -- ~15 min


CREATE OR REPLACE TABLE etablissements AS
    SELECT
	identifiant_de_l_etablissement,
	nom_etablissement,
	type_etablissement,
	libelle_nature,
	adresse_1,
	adresse_2,
	adresse_3,
	code_postal,
	nombre_d_eleves AS nb_eleves,
	code_commune,
	nom_commune,
	code_departement,
	libelle_departement,
	code_region,
	libelle_region,
	FLOOR(RANDOM() * (getvariable('nb_eleves_max') - getvariable('nb_eleves_min') + 1)) + getvariable('nb_eleves_min') AS nb_eleves,
	FLOOR(RANDOM() * (getvariable('surface_exploitable_max') - getvariable('surface_exploitable_min') + 1)) + getvariable('surface_exploitable_min') AS surface_exploitable_max,
	FLOOR(RANDOM() * (getvariable('potentiel_solaire_max') - getvariable('potentiel_solaire_min') + 1)) + getvariable('potentiel_solaire_min') AS potentiel_solaire,
	0 AS potentiel_nb_foyers,
	NULL::VARCHAR AS niveau_potentiel,
	(RANDOM() < 0.5) AS protection,
	geom
	FROM ST_Read(getvariable('path_to_folder') || 'fr-en-annuaire-education.geojson') etab;
	-- FROM ST_Read('https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-annuaire-education/exports/geojson?lang=fr') etab; --42s

-- 2. maj count_etablissements, count_etablissements_proteges, surface_exploitable, potentiel_solaire depuis les tables créées
-- certains etablissements ont le meme identifiant, peut etre que le calcul n'est pas correct
--WITH duplicateEtablissements as(
--SELECT identifiant_de_l_etablissement FROM etablissements GROUP BY identifiant_de_l_etablissement HAVING count() > 1)
--SELECT e.* FROM duplicateEtablissements INNER JOIN etablissements e  ON e.identifiant_de_l_etablissement = duplicateEtablissements.identifiant_de_l_etablissement;

--maj etablissements
UPDATE etablissements e
SET potentiel_nb_foyers = FLOOR(e.potentiel_solaire / 5000),
niveau_potentiel = CASE
					WHEN e.potentiel_solaire >= 250000 THEN '1_HIGH'
					WHEN e.potentiel_solaire >= 100000 THEN '2_GOOD'
					ELSE '3_LIMITED' END;

-- maj regions
UPDATE regions r
SET nb_eleves_total = regionEtablissements.nb_eleves_total,
nb_eleves_lycees = regionEtablissements.nb_eleves_lycees,
nb_etablissements_total = regionEtablissements.nb_etablissements_total,
nb_etablissements_lycees = regionEtablissements.nb_etablissements_lycees,
nb_etablissements_proteges_total = regionEtablissements.nb_etablissements_proteges_total,
nb_etablissements_proteges_lycees = regionEtablissements.nb_etablissements_proteges_lycees,
surface_exploitable_max_total = regionEtablissements.surface_exploitable_max_total,
surface_exploitable_max_lycees = regionEtablissements.surface_exploitable_max_lycees,
potentiel_solaire_total = regionEtablissements.potentiel_solaire_total,
potentiel_solaire_lycees = regionEtablissements.potentiel_solaire_lycees,
potentiel_solaire_colleges = regionEtablissements.potentiel_solaire_colleges,
potentiel_solaire_primaires = regionEtablissements.potentiel_solaire_primaires,
potentiel_nb_foyers_total = regionEtablissements.potentiel_nb_foyers_total,
potentiel_nb_foyers_lycees = regionEtablissements.potentiel_nb_foyers_lycees
FROM (
    SELECT e.code_region,
	SUM(e.nb_eleves) AS nb_eleves_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.nb_eleves ELSE 0 END) AS nb_eleves_lycees,
	COUNT(*) AS nb_etablissements_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN 1 ELSE 0 END) AS nb_etablissements_lycees,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' AND e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_lycees,
	SUM(e.surface_exploitable_max) AS surface_exploitable_max_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.surface_exploitable_max ELSE 0 END) AS surface_exploitable_max_lycees,
	SUM(e.potentiel_solaire) AS potentiel_solaire_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_lycees,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_colleges,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_primaires,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.potentiel_nb_foyers ELSE 0 END) AS potentiel_nb_foyers_lycees
    FROM etablissements e
    GROUP BY e.code_region
) AS regionEtablissements
WHERE r.code_region = regionEtablissements.code_region;

UPDATE regions r
SET 
  nb_etablissements_par_niveau_potentiel_total = json_object(
    '1_HIGH', nb_high_total,
    '2_MEDIUM', nb_medium_total,
    '3_LOW', nb_low_total
  ),
  nb_etablissements_par_niveau_potentiel_lycees = json_object(
    '1_HIGH', nb_high_lycees,
    '2_MEDIUM', nb_medium_lycees,
    '3_LOW', nb_low_lycees
  )
FROM (
    SELECT e.code_region,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' AND e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_lycees,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' AND e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_lycees,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' AND e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_lycees,
	SUM(CASE WHEN e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_total,
	SUM(CASE WHEN e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_total,
	SUM(CASE WHEN e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_total
    FROM etablissements e
    GROUP BY e.code_region
) AS regionEtablissements
WHERE r.code_region = regionEtablissements.code_region;

-- update regions top3 total
-- Step 1: Rank and filter top 3 per region
WITH ranked_etablissements AS (
    SELECT 
        e.code_region,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'type_etablissement', e.type_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_region 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_region, rank
),
-- Step 3: Group into JSON array
region_jsons AS (
    SELECT 
        code_region,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_region
)
-- Step 4: Update the regions table
UPDATE regions r
SET top_etablissements_total = rj.top_etablissements_json
FROM region_jsons rj
WHERE r.code_region = rj.code_region;

-- update regions top 3 lycees
-- Step 1: Rank and filter top 3 per region
WITH ranked_etablissements AS (
    SELECT 
        e.code_region,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_region 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
	WHERE e.type_etablissement = 'Lycée'
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_region, rank
),
-- Step 3: Group into JSON array
region_jsons AS (
    SELECT 
        code_region,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_region
)
-- Step 4: Update the regions table
UPDATE regions r
SET top_etablissements_lycees = rj.top_etablissements_json
FROM region_jsons rj
WHERE r.code_region = rj.code_region;

-- maj departements
UPDATE departements d
SET nb_eleves_total = departementEtablissements.nb_eleves_total,
nb_eleves_colleges = departementEtablissements.nb_eleves_colleges,
nb_etablissements_total = departementEtablissements.nb_etablissements_total,
nb_etablissements_colleges = departementEtablissements.nb_etablissements_colleges,
nb_etablissements_proteges_total = departementEtablissements.nb_etablissements_proteges_total,
nb_etablissements_proteges_colleges = departementEtablissements.nb_etablissements_proteges_colleges,
surface_exploitable_max_total = departementEtablissements.surface_exploitable_max_total,
surface_exploitable_max_colleges = departementEtablissements.surface_exploitable_max_colleges,
potentiel_solaire_total = departementEtablissements.potentiel_solaire_total,
potentiel_solaire_lycees = departementEtablissements.potentiel_solaire_lycees,
potentiel_solaire_colleges = departementEtablissements.potentiel_solaire_colleges,
potentiel_solaire_primaires = departementEtablissements.potentiel_solaire_primaires,
potentiel_nb_foyers_total = departementEtablissements.potentiel_nb_foyers_total,
potentiel_nb_foyers_colleges = departementEtablissements.potentiel_nb_foyers_colleges
FROM (
	SELECT e.code_departement,
	SUM(e.nb_eleves) AS nb_eleves_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.nb_eleves ELSE 0 END) AS nb_eleves_colleges,
	COUNT(*) AS nb_etablissements_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN 1 ELSE 0 END) AS nb_etablissements_colleges,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' AND e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_colleges,
	SUM(e.surface_exploitable_max) AS surface_exploitable_max_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.surface_exploitable_max ELSE 0 END) AS surface_exploitable_max_colleges,
	SUM(e.potentiel_solaire) AS potentiel_solaire_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_lycees,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_colleges,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_primaires,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.potentiel_nb_foyers ELSE 0 END) AS potentiel_nb_foyers_colleges
	FROM etablissements e
	GROUP BY e.code_departement
) AS departementEtablissements
WHERE d.code_departement = departementEtablissements.code_departement;

UPDATE departements d
SET 
  nb_etablissements_par_niveau_potentiel_total = json_object(
    '1_HIGH', nb_high_total,
    '2_MEDIUM', nb_medium_total,
    '3_LOW', nb_low_total
  ),
  nb_etablissements_par_niveau_potentiel_colleges = json_object(
    '1_HIGH', nb_high_colleges,
    '2_MEDIUM', nb_medium_colleges,
    '3_LOW', nb_low_colleges
  )
FROM (
	SELECT e.code_departement,
	SUM(CASE WHEN e.type_etablissement = 'Collège' AND e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_colleges,
	SUM(CASE WHEN e.type_etablissement = 'Collège' AND e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_colleges,
	SUM(CASE WHEN e.type_etablissement = 'Collège' AND e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_colleges,
	SUM(CASE WHEN e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_total,
	SUM(CASE WHEN e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_total,
	SUM(CASE WHEN e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_total
	FROM etablissements e
	GROUP BY e.code_departement
) AS departementEtablissements
WHERE d.code_departement = departementEtablissements.code_departement;

-- update departements top3 total
-- Step 1: Rank and filter top 3 per departement
WITH ranked_etablissements AS (
    SELECT 
        e.code_departement,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'type_etablissement', e.type_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_departement 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_departement, rank
),
-- Step 3: Group into JSON array
departement_jsons AS (
    SELECT 
        code_departement,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_departement
)
-- Step 4: Update the departements table
UPDATE departements d
SET top_etablissements_total = dj.top_etablissements_json
FROM departement_jsons dj
WHERE d.code_departement = dj.code_departement;

-- update departements top 3 colleges
-- Step 1: Rank and filter top 3 per departement
WITH ranked_etablissements AS (
    SELECT 
        e.code_departement,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_departement 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
	WHERE e.type_etablissement = 'Collège'
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_departement, rank
),
-- Step 3: Group into JSON array
departement_jsons AS (
    SELECT 
        code_departement,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_departement
)
-- Step 4: Update the departements table
UPDATE departements d
SET top_etablissements_colleges = dj.top_etablissements_json
FROM departement_jsons dj
WHERE d.code_departement = dj.code_departement;

-- maj communes
UPDATE communes c
SET nb_eleves_total = communeEtablissements.nb_eleves_total,
nb_eleves_primaires = communeEtablissements.nb_eleves_primaires,
nb_etablissements_total = communeEtablissements.nb_etablissements_total,
nb_etablissements_primaires = communeEtablissements.nb_etablissements_primaires,
nb_etablissements_proteges_total = communeEtablissements.nb_etablissements_proteges_total,
nb_etablissements_proteges_primaires = communeEtablissements.nb_etablissements_proteges_primaires,
surface_exploitable_max_total = communeEtablissements.surface_exploitable_max_total,
surface_exploitable_max_primaires = communeEtablissements.surface_exploitable_max_primaires,
potentiel_solaire_total = communeEtablissements.potentiel_solaire_total,
potentiel_solaire_lycees = communeEtablissements.potentiel_solaire_lycees,
potentiel_solaire_colleges = communeEtablissements.potentiel_solaire_colleges,
potentiel_solaire_primaires = communeEtablissements.potentiel_solaire_primaires,
potentiel_nb_foyers_total = communeEtablissements.potentiel_nb_foyers_total,
potentiel_nb_foyers_primaires = communeEtablissements.potentiel_nb_foyers_primaires
FROM (
	SELECT e.code_commune,
	SUM(e.nb_eleves) AS nb_eleves_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.nb_eleves ELSE 0 END) AS nb_eleves_primaires,
	COUNT(*) AS nb_etablissements_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN 1 ELSE 0 END) AS nb_etablissements_primaires,
	SUM(CASE WHEN e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' AND e.protection THEN 1 ELSE 0 END) AS nb_etablissements_proteges_primaires,
	SUM(e.surface_exploitable_max) AS surface_exploitable_max_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.surface_exploitable_max ELSE 0 END) AS surface_exploitable_max_primaires,
	SUM(e.potentiel_solaire) AS potentiel_solaire_total,
	SUM(CASE WHEN e.type_etablissement = 'Lycée' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_lycees,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Collège' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_colleges,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.potentiel_solaire ELSE 0 END) AS potentiel_solaire_primaires,
	SUM(e.potentiel_nb_foyers) AS potentiel_nb_foyers_total,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' THEN e.potentiel_nb_foyers ELSE 0 END) AS potentiel_nb_foyers_primaires
	FROM etablissements e
	GROUP BY e.code_commune
) AS communeEtablissements
WHERE c.code_commune = communeEtablissements.code_commune;

UPDATE communes c
SET 
  nb_etablissements_par_niveau_potentiel_total = json_object(
    '1_HIGH', nb_high_total,
    '2_MEDIUM', nb_medium_total,
    '3_LOW', nb_low_total
  ),
  nb_etablissements_par_niveau_potentiel_primaires = json_object(
    '1_HIGH', nb_high_primaires,
    '2_MEDIUM', nb_medium_primaires,
    '3_LOW', nb_low_primaires
  )
FROM (
	SELECT e.code_commune,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' AND e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_primaires,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' AND e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_primaires,
	SUM(CASE WHEN e.type_etablissement = 'Ecole' AND e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_primaires,
	SUM(CASE WHEN e.niveau_potentiel = '1_HIGH' THEN 1 ELSE 0 END) AS nb_high_total,
	SUM(CASE WHEN e.niveau_potentiel = '2_MEDIUM' THEN 1 ELSE 0 END) AS nb_medium_total,
	SUM(CASE WHEN e.niveau_potentiel = '3_LOW' THEN 1 ELSE 0 END) AS nb_low_total
	FROM etablissements e
	GROUP BY e.code_commune
) AS communeEtablissements
WHERE c.code_commune = communeEtablissements.code_commune;


-- update communes top3 total
-- Step 1: Rank and filter top 3 per commune
WITH ranked_etablissements AS (
    SELECT 
        e.code_commune,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'type_etablissement', e.type_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_commune 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_commune, rank
),
-- Step 3: Group into JSON array
commune_jsons AS (
    SELECT 
        code_commune,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_commune
)
-- Step 4: Update the communes table
UPDATE communes c
SET top_etablissements_total = cj.top_etablissements_json
FROM commune_jsons cj
WHERE c.code_commune = cj.code_commune;

-- update communes top 3 ecoles
-- Step 1: Rank and filter top 3 per commune
WITH ranked_etablissements AS (
    SELECT 
        e.code_commune,
        json_object(
            'id', e.identifiant_de_l_etablissement,
            'libelle', e.nom_etablissement,
            'potentiel_solaire', e.potentiel_solaire
        ) AS row_json,
        ROW_NUMBER() OVER (
            PARTITION BY e.code_commune 
            ORDER BY e.potentiel_solaire DESC
        ) AS rank
    FROM etablissements e
	WHERE e.type_etablissement = 'Ecole'
),
-- Step 2: Reorder rows BEFORE aggregation
ordered_rows AS (
    SELECT * 
    FROM ranked_etablissements
    WHERE rank <= 3
    ORDER BY code_commune, rank
),
-- Step 3: Group into JSON array
commune_jsons AS (
    SELECT 
        code_commune,
        json_group_array(row_json) AS top_etablissements_json
    FROM ordered_rows
    GROUP BY code_commune
)
-- Step 4: Update the communes table
UPDATE communes c
SET top_etablissements_primaires = cj.top_etablissements_json
FROM commune_jsons cj
WHERE c.code_commune = cj.code_commune;

-- create reference table between code_postal and code_insee
-- source : https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/
CREATE OR REPLACE TABLE ref_code_postal AS
SELECT DISTINCT ON(code_insee, code_postal) "#Code_commune_INSEE" AS code_insee, Code_postal AS code_postal
FROM read_parquet('https://object.files.data.gouv.fr/hydra-parquet/hydra-parquet/54535896c301b2b3928f8db6305309ad.parquet'); -- 0.7s

-- create materialized view with a common libelle column on every tables
-- On nettoie le libellé dans la colonne sanitized_libelle :
-- 1. suppression des accents
-- 2. remplacement de la ponctuation par des espaces
-- 3. suppression des doublons d'espaces
-- 4. conversion en lowercase.
CREATE OR REPLACE TABLE search_view AS 
SELECT 
'etablissements' AS source_table, 
identifiant_de_l_etablissement as id, 
nom_etablissement AS libelle, 
lower(regexp_replace(regexp_replace(strip_accents(nom_etablissement), '[^\w\s]', ' ', 'g'), '[\s]{2,}', ' ', 'g')) AS sanitized_libelle, 
to_json(struct_pack(nom_commune, code_postal)) AS extra_data 
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
