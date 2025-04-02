INSTALL spatial;
LOAD spatial;

-- 1: export geojson (optionnel)
-- Il faut renseigner le chemin absolu car l'utilisation de variable dans le paramètre COPY..TO n'est pas supporté
COPY (
SELECT *
FROM
	regions
)
TO '/app/output/regions.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Régions');

COPY (
SELECT *
FROM
	departements
) TO '/app/output/departements.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Départements');

COPY (
SELECT *
FROM
	communes
) TO '/app/output/communes.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Communes');

COPY (
SELECT *
FROM
	etablissements
) TO '/app/output/etablissements.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON', LAYER_NAME 'Etablissements');

