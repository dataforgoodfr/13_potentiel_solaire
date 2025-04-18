import { DuckDBPreparedStatement } from '@duckdb/node-api';

import { CommuneFeature, CommunesGeoJSON } from '../models/communes';
import { DepartementFeature, DepartementsGeoJSON } from '../models/departements';
import {
	Etablissement,
	EtablissementFeature,
	EtablissementsGeoJSON,
} from '../models/etablissements';
import { RegionFeature } from '../models/regions';
import { SearchResult } from '../models/search';
import { isCodePostal, sanitizeString } from '../utils/string-utils';
import {
	COMMUNES_MAPPING,
	COMMUNES_TABLE,
	DEPARTEMENTS_MAPPING,
	DEPARTEMENTS_TABLE,
	ETABLISSEMENTS_MAPPING,
	ETABLISSEMENTS_TABLE,
	REF_CODE_POSTAL_MAPPING,
	REF_CODE_POSTAL_TABLE,
	REGIONS_MAPPING,
	REGIONS_TABLE,
	SEARCH_VIEW_MAPPING,
	SEARCH_VIEW_TABLE,
} from './db-mapping';
import db from './duckdb';

/**
 * A simple longitude and latitude object.
 */
export type SimpleLngLat = {
	lat: number;
	lng: number;
};

/**
 * A simple bounding box with only lat and lng of the south west and north east corners.
 */
export type SimpleBoundingBox = {
	southWest: SimpleLngLat;
	northEast: SimpleLngLat;
};

// --- Etablissements ---
export async function fetchEtablissements(codeCommune: string | null): Promise<Etablissement[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		let prepared: DuckDBPreparedStatement;
		if (codeCommune) {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_MAPPING.geom}), ST_X(etab.${ETABLISSEMENTS_MAPPING.geom}) as longitude, ST_Y(etab.${ETABLISSEMENTS_MAPPING.geom}) as latitude
        FROM main.${ETABLISSEMENTS_TABLE} etab
        WHERE etab.${ETABLISSEMENTS_MAPPING.code_commune} = $1;
        `,
			);
			prepared.bindVarchar(1, codeCommune);
		} else {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_MAPPING.geom}), ST_X(etab.${ETABLISSEMENTS_MAPPING.geom}) as longitude, ST_Y(etab.${ETABLISSEMENTS_MAPPING.geom}) as latitude
        FROM main.${ETABLISSEMENTS_TABLE} etab;
        `,
			);
		}

		const reader = await prepared.runAndReadAll();
		return reader.getRowObjectsJson() as unknown as Etablissement[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch etablissements rows.');
	}
}

export async function fetchEtablissementsFromBoundingBox({
	southWest,
	northEast,
}: SimpleBoundingBox): Promise<Etablissement[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_MAPPING.geom}), ST_X(etab.${ETABLISSEMENTS_MAPPING.geom}) as longitude, ST_Y(etab.${ETABLISSEMENTS_MAPPING.geom}) as latitude
        FROM main.${COMMUNES_TABLE} com
        INNER JOIN main.${ETABLISSEMENTS_TABLE} etab ON etab.${ETABLISSEMENTS_MAPPING.code_commune} = com.${COMMUNES_MAPPING.code_commune}
        WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), com.${COMMUNES_MAPPING.geom});
		`,
		);
		prepared.bindDouble(1, southWest.lng);
		prepared.bindDouble(2, southWest.lat);
		prepared.bindDouble(3, northEast.lng);
		prepared.bindDouble(4, northEast.lat);
		const reader = await prepared.runAndReadAll();
		return reader.getRowObjectsJson() as unknown as Etablissement[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch etablissements rows.');
	}
}

export async function fetchEtablissementsGeoJSON(
	codeCommune: string | null,
): Promise<EtablissementsGeoJSON> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
				'type','FeatureCollection',
				'features',
				COALESCE(json_group_array(
					json_object(
					'type','Feature',
					'properties',
					json_object(
						'${ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement}',
						e.${ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement},
						'${ETABLISSEMENTS_MAPPING.nom_etablissement}',
						e.${ETABLISSEMENTS_MAPPING.nom_etablissement},
						'${ETABLISSEMENTS_MAPPING.type_etablissement}',
						e.${ETABLISSEMENTS_MAPPING.type_etablissement},
						'${ETABLISSEMENTS_MAPPING.libelle_nature}',
						e.${ETABLISSEMENTS_MAPPING.libelle_nature},
						'${ETABLISSEMENTS_MAPPING.adresse_1}',
						e.${ETABLISSEMENTS_MAPPING.adresse_1},
						'${ETABLISSEMENTS_MAPPING.adresse_2}',
						e.${ETABLISSEMENTS_MAPPING.adresse_2},
						'${ETABLISSEMENTS_MAPPING.adresse_3}',
						e.${ETABLISSEMENTS_MAPPING.adresse_3},
						'${ETABLISSEMENTS_MAPPING.code_postal}',
						e.${ETABLISSEMENTS_MAPPING.code_postal},
						'${ETABLISSEMENTS_MAPPING.nb_eleves}',
						e.${ETABLISSEMENTS_MAPPING.nb_eleves},
						'${ETABLISSEMENTS_MAPPING.code_commune}',
						e.${ETABLISSEMENTS_MAPPING.code_commune},
						'${ETABLISSEMENTS_MAPPING.nom_commune}',
						e.${ETABLISSEMENTS_MAPPING.nom_commune},
						'${ETABLISSEMENTS_MAPPING.code_departement}',
						e.${ETABLISSEMENTS_MAPPING.code_departement},
						'${ETABLISSEMENTS_MAPPING.libelle_departement}',
						e.${ETABLISSEMENTS_MAPPING.libelle_departement},
						'${ETABLISSEMENTS_MAPPING.code_region}',
						e.${ETABLISSEMENTS_MAPPING.code_region},
						'${ETABLISSEMENTS_MAPPING.libelle_region}',
						e.${ETABLISSEMENTS_MAPPING.libelle_region},
						'${ETABLISSEMENTS_MAPPING.surface_exploitable_max}',
						e.${ETABLISSEMENTS_MAPPING.surface_exploitable_max},
						'${ETABLISSEMENTS_MAPPING.potentiel_solaire}',
						e.${ETABLISSEMENTS_MAPPING.potentiel_solaire},
						'${ETABLISSEMENTS_MAPPING.potentiel_nb_foyers}',
						e.${ETABLISSEMENTS_MAPPING.potentiel_nb_foyers},
						'${ETABLISSEMENTS_MAPPING.protection}',
						e.${ETABLISSEMENTS_MAPPING.protection}
					),
					'geometry', ST_AsGeoJSON(e.${ETABLISSEMENTS_MAPPING.geom})::JSON
					)
				), [])
			) as geojson FROM main.${ETABLISSEMENTS_TABLE} e
		` + (codeCommune ? `WHERE e.${ETABLISSEMENTS_MAPPING.code_commune} = $1` : ''),
		);
		if (codeCommune) {
			prepared.bindVarchar(1, codeCommune);
		}

		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch etablissements rows.');
	}
}

export async function fetchEtablissementGeoJSONById(
	id: string,
): Promise<EtablissementFeature | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
				'type','Feature',
				'properties',
				json_object(
					'${ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement}',
					e.${ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement},
					'${ETABLISSEMENTS_MAPPING.nom_etablissement}',
					e.${ETABLISSEMENTS_MAPPING.nom_etablissement},
					'${ETABLISSEMENTS_MAPPING.type_etablissement}',
					e.${ETABLISSEMENTS_MAPPING.type_etablissement},
					'${ETABLISSEMENTS_MAPPING.libelle_nature}',
					e.${ETABLISSEMENTS_MAPPING.libelle_nature},
					'${ETABLISSEMENTS_MAPPING.adresse_1}',
					e.${ETABLISSEMENTS_MAPPING.adresse_1},
					'${ETABLISSEMENTS_MAPPING.adresse_2}',
					e.${ETABLISSEMENTS_MAPPING.adresse_2},
					'${ETABLISSEMENTS_MAPPING.adresse_3}',
					e.${ETABLISSEMENTS_MAPPING.adresse_3},
					'${ETABLISSEMENTS_MAPPING.code_postal}',
					e.${ETABLISSEMENTS_MAPPING.code_postal},
					'${ETABLISSEMENTS_MAPPING.nb_eleves}',
					e.${ETABLISSEMENTS_MAPPING.nb_eleves},
					'${ETABLISSEMENTS_MAPPING.code_commune}',
					e.${ETABLISSEMENTS_MAPPING.code_commune},
					'${ETABLISSEMENTS_MAPPING.nom_commune}',
					e.${ETABLISSEMENTS_MAPPING.nom_commune},
					'${ETABLISSEMENTS_MAPPING.code_departement}',
					e.${ETABLISSEMENTS_MAPPING.code_departement},
					'${ETABLISSEMENTS_MAPPING.libelle_departement}',
					e.${ETABLISSEMENTS_MAPPING.libelle_departement},
					'${ETABLISSEMENTS_MAPPING.code_region}',
					e.${ETABLISSEMENTS_MAPPING.code_region},
					'${ETABLISSEMENTS_MAPPING.libelle_region}',
					e.${ETABLISSEMENTS_MAPPING.libelle_region},
					'${ETABLISSEMENTS_MAPPING.surface_exploitable_max}',
					e.${ETABLISSEMENTS_MAPPING.surface_exploitable_max},
					'${ETABLISSEMENTS_MAPPING.potentiel_solaire}',
					e.${ETABLISSEMENTS_MAPPING.potentiel_solaire},
					'${ETABLISSEMENTS_MAPPING.potentiel_nb_foyers}',
					e.${ETABLISSEMENTS_MAPPING.potentiel_nb_foyers},
					'${ETABLISSEMENTS_MAPPING.protection}',
					e.${ETABLISSEMENTS_MAPPING.protection}
				),
				'geometry', ST_AsGeoJSON(e.${ETABLISSEMENTS_MAPPING.geom})::JSON
			) as geojson
			FROM main.${ETABLISSEMENTS_TABLE} e
			WHERE e.${ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowsJson()?.[0]?.[0];
		return result ? JSON.parse(result as string) : null;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch etablissements rows.');
	}
}

// --- Communes ---
export async function fetchCommunesFromBoundingBox({
	southWest,
	northEast,
}: SimpleBoundingBox): Promise<CommunesGeoJSON> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
			'type','FeatureCollection',
			'features',
			COALESCE(json_group_array(
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${COMMUNES_MAPPING.code_commune}',
				c.${COMMUNES_MAPPING.code_commune},
				'${COMMUNES_MAPPING.nom_commune}',
				c.${COMMUNES_MAPPING.nom_commune},
				'${COMMUNES_MAPPING.code_departement}',
				c.${COMMUNES_MAPPING.code_departement},
				'${COMMUNES_MAPPING.libelle_departement}',
				c.${COMMUNES_MAPPING.libelle_departement},
				'${COMMUNES_MAPPING.code_region}',
				c.${COMMUNES_MAPPING.code_region},
				'${COMMUNES_MAPPING.libelle_region}',
				c.${COMMUNES_MAPPING.libelle_region},
				'${COMMUNES_MAPPING.surface_exploitable_max_total}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_total},
				'${COMMUNES_MAPPING.surface_exploitable_max_primaires}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_primaires},
				'${COMMUNES_MAPPING.potentiel_solaire_total}',
				c.${COMMUNES_MAPPING.potentiel_solaire_total},
				'${COMMUNES_MAPPING.potentiel_solaire_primaires}',
				c.${COMMUNES_MAPPING.potentiel_solaire_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_total},
				'${COMMUNES_MAPPING.nb_etablissements_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_total},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_primaires},
				'${COMMUNES_MAPPING.nb_eleves_total}',
				c.${COMMUNES_MAPPING.nb_eleves_total},
				'${COMMUNES_MAPPING.nb_eleves_primaires}',
				c.${COMMUNES_MAPPING.nb_eleves_primaires},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_total}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_total},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_primaires}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_primaires},
				'${COMMUNES_MAPPING.top_etablissements_total}',
				c.${COMMUNES_MAPPING.top_etablissements_total},
				'${COMMUNES_MAPPING.top_etablissements_primaires}',
				c.${COMMUNES_MAPPING.top_etablissements_primaires}
				),
				'geometry', ST_AsGeoJSON(c.${COMMUNES_MAPPING.geom})::JSON
				)
			), [])
		) as geojson FROM main.${DEPARTEMENTS_TABLE} dept
		INNER JOIN main.${COMMUNES_TABLE} c ON c.${COMMUNES_MAPPING.code_departement} = dept.${DEPARTEMENTS_MAPPING.code_departement}
		WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), dept.${DEPARTEMENTS_MAPPING.geom});
		`,
		);
		prepared.bindDouble(1, southWest.lng);
		prepared.bindDouble(2, southWest.lat);
		prepared.bindDouble(3, northEast.lng);
		prepared.bindDouble(4, northEast.lat);
		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch communes rows.');
	}
}

/**
 * Fetch one commune containing the provided latitude and longitude coordinates.
 * If nothing is enclosing the coordinates, it returns null.
 * @returns
 */
export async function fetchCommuneContainsLatLng({
	lat,
	lng,
}: SimpleLngLat): Promise<CommuneFeature | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
		SELECT
		json_object(
			'type','Feature',
			'properties',
			json_object(
			'${COMMUNES_MAPPING.code_commune}',
			c.${COMMUNES_MAPPING.code_commune},
			'${COMMUNES_MAPPING.nom_commune}',
			c.${COMMUNES_MAPPING.nom_commune},
			'${COMMUNES_MAPPING.code_departement}',
			c.${COMMUNES_MAPPING.code_departement},
			'${COMMUNES_MAPPING.libelle_departement}',
			c.${COMMUNES_MAPPING.libelle_departement},
			'${COMMUNES_MAPPING.code_region}',
			c.${COMMUNES_MAPPING.code_region},
			'${COMMUNES_MAPPING.libelle_region}',
			c.${COMMUNES_MAPPING.libelle_region},
			'${COMMUNES_MAPPING.surface_exploitable_max_total}',
			c.${COMMUNES_MAPPING.surface_exploitable_max_total},
			'${COMMUNES_MAPPING.surface_exploitable_max_primaires}',
			c.${COMMUNES_MAPPING.surface_exploitable_max_primaires},
			'${COMMUNES_MAPPING.potentiel_solaire_total}',
			c.${COMMUNES_MAPPING.potentiel_solaire_total},
			'${COMMUNES_MAPPING.potentiel_solaire_primaires}',
			c.${COMMUNES_MAPPING.potentiel_solaire_primaires},
			'${COMMUNES_MAPPING.nb_etablissements_total}',
			c.${COMMUNES_MAPPING.nb_etablissements_total},
			'${COMMUNES_MAPPING.nb_etablissements_primaires}',
			c.${COMMUNES_MAPPING.nb_etablissements_primaires},
			'${COMMUNES_MAPPING.nb_etablissements_proteges_total}',
			c.${COMMUNES_MAPPING.nb_etablissements_proteges_total},
			'${COMMUNES_MAPPING.nb_etablissements_proteges_primaires}',
			c.${COMMUNES_MAPPING.nb_etablissements_proteges_primaires},
			'${COMMUNES_MAPPING.nb_eleves_total}',
			c.${COMMUNES_MAPPING.nb_eleves_total},
			'${COMMUNES_MAPPING.nb_eleves_primaires}',
			c.${COMMUNES_MAPPING.nb_eleves_primaires},
			'${COMMUNES_MAPPING.potentiel_nb_foyers_total}',
			c.${COMMUNES_MAPPING.potentiel_nb_foyers_total},
			'${COMMUNES_MAPPING.potentiel_nb_foyers_primaires}',
			c.${COMMUNES_MAPPING.potentiel_nb_foyers_primaires},
			'${COMMUNES_MAPPING.top_etablissements_total}',
			c.${COMMUNES_MAPPING.top_etablissements_total},
			'${COMMUNES_MAPPING.top_etablissements_primaires}',
			c.${COMMUNES_MAPPING.top_etablissements_primaires}
			),
			'geometry', ST_AsGeoJSON(c.${COMMUNES_MAPPING.geom})::JSON
		) as geojson
		FROM main.${COMMUNES_TABLE} c
		WHERE ST_CONTAINS(c.${COMMUNES_MAPPING.geom}, ST_POINT($1, $2))`,
		);
		prepared.bindFloat(1, lng);
		prepared.bindFloat(2, lat);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowsJson()?.[0]?.[0];
		return result ? JSON.parse(result as string) : null;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch communes rows.');
	}
}

export async function fetchCommunesGeoJSON(
	codeDepartement: string | null,
): Promise<CommunesGeoJSON> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
		SELECT
			json_object(
			'type','FeatureCollection',
			'features',
			COALESCE(json_group_array(
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${COMMUNES_MAPPING.code_commune}',
				c.${COMMUNES_MAPPING.code_commune},
				'${COMMUNES_MAPPING.nom_commune}',
				c.${COMMUNES_MAPPING.nom_commune},
				'${COMMUNES_MAPPING.code_departement}',
				c.${COMMUNES_MAPPING.code_departement},
				'${COMMUNES_MAPPING.libelle_departement}',
				c.${COMMUNES_MAPPING.libelle_departement},
				'${COMMUNES_MAPPING.code_region}',
				c.${COMMUNES_MAPPING.code_region},
				'${COMMUNES_MAPPING.libelle_region}',
				c.${COMMUNES_MAPPING.libelle_region},
				'${COMMUNES_MAPPING.surface_exploitable_max_total}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_total},
				'${COMMUNES_MAPPING.surface_exploitable_max_primaires}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_primaires},
				'${COMMUNES_MAPPING.potentiel_solaire_total}',
				c.${COMMUNES_MAPPING.potentiel_solaire_total},
				'${COMMUNES_MAPPING.potentiel_solaire_primaires}',
				c.${COMMUNES_MAPPING.potentiel_solaire_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_total},
				'${COMMUNES_MAPPING.nb_etablissements_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_total},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_primaires},
				'${COMMUNES_MAPPING.nb_eleves_total}',
				c.${COMMUNES_MAPPING.nb_eleves_total},
				'${COMMUNES_MAPPING.nb_eleves_primaires}',
				c.${COMMUNES_MAPPING.nb_eleves_primaires},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_total}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_total},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_primaires}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_primaires},
				'${COMMUNES_MAPPING.top_etablissements_total}',
				c.${COMMUNES_MAPPING.top_etablissements_total},
				'${COMMUNES_MAPPING.top_etablissements_primaires}',
				c.${COMMUNES_MAPPING.top_etablissements_primaires}
				),
				'geometry', ST_AsGeoJSON(c.${COMMUNES_MAPPING.geom})::JSON
				)
			), [])
		) as geojson FROM main.${COMMUNES_TABLE} c
		` + (codeDepartement ? `WHERE c.${COMMUNES_MAPPING.code_departement} = $1` : ''),
		);
		if (codeDepartement) {
			prepared.bindVarchar(1, codeDepartement);
		}

		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch communes rows.');
	}
}

export async function fetchCommuneFeature(id: string): Promise<CommuneFeature | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${COMMUNES_MAPPING.code_commune}',
				c.${COMMUNES_MAPPING.code_commune},
				'${COMMUNES_MAPPING.nom_commune}',
				c.${COMMUNES_MAPPING.nom_commune},
				'${COMMUNES_MAPPING.code_departement}',
				c.${COMMUNES_MAPPING.code_departement},
				'${COMMUNES_MAPPING.libelle_departement}',
				c.${COMMUNES_MAPPING.libelle_departement},
				'${COMMUNES_MAPPING.code_region}',
				c.${COMMUNES_MAPPING.code_region},
				'${COMMUNES_MAPPING.libelle_region}',
				c.${COMMUNES_MAPPING.libelle_region},
				'${COMMUNES_MAPPING.surface_exploitable_max_total}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_total},
				'${COMMUNES_MAPPING.surface_exploitable_max_primaires}',
				c.${COMMUNES_MAPPING.surface_exploitable_max_primaires},
				'${COMMUNES_MAPPING.potentiel_solaire_total}',
				c.${COMMUNES_MAPPING.potentiel_solaire_total},
				'${COMMUNES_MAPPING.potentiel_solaire_primaires}',
				c.${COMMUNES_MAPPING.potentiel_solaire_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_total},
				'${COMMUNES_MAPPING.nb_etablissements_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_primaires},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_total}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_total},
				'${COMMUNES_MAPPING.nb_etablissements_proteges_primaires}',
				c.${COMMUNES_MAPPING.nb_etablissements_proteges_primaires},
				'${COMMUNES_MAPPING.nb_eleves_total}',
				c.${COMMUNES_MAPPING.nb_eleves_total},
				'${COMMUNES_MAPPING.nb_eleves_primaires}',
				c.${COMMUNES_MAPPING.nb_eleves_primaires},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_total}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_total},
				'${COMMUNES_MAPPING.potentiel_nb_foyers_primaires}',
				c.${COMMUNES_MAPPING.potentiel_nb_foyers_primaires},
				'${COMMUNES_MAPPING.top_etablissements_total}',
				c.${COMMUNES_MAPPING.top_etablissements_total},
				'${COMMUNES_MAPPING.top_etablissements_primaires}',
				c.${COMMUNES_MAPPING.top_etablissements_primaires}
				),
				'geometry', ST_AsGeoJSON(c.${COMMUNES_MAPPING.geom})::JSON
			) as geojson
			FROM main.${COMMUNES_TABLE} c
			WHERE c.${COMMUNES_MAPPING.code_commune} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowsJson()?.[0]?.[0];
		return result ? JSON.parse(result as string) : null;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch communes rows.');
	}
}

// --- Départements ---
export async function fetchDepartementsGeoJSON(
	codeRegion: string | null,
): Promise<DepartementsGeoJSON> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
		SELECT
			json_object(
			'type','FeatureCollection',
			'features',
			COALESCE(json_group_array(
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${DEPARTEMENTS_MAPPING.code_departement}',
				d.${DEPARTEMENTS_MAPPING.code_departement},
				'${DEPARTEMENTS_MAPPING.libelle_departement}',
				d.${DEPARTEMENTS_MAPPING.libelle_departement},
				'${DEPARTEMENTS_MAPPING.code_region}',
				d.${DEPARTEMENTS_MAPPING.code_region},
				'${DEPARTEMENTS_MAPPING.libelle_region}',
				d.${DEPARTEMENTS_MAPPING.libelle_region},
				'${DEPARTEMENTS_MAPPING.surface_exploitable_max_total}',
				d.${DEPARTEMENTS_MAPPING.surface_exploitable_max_total},
				'${DEPARTEMENTS_MAPPING.surface_exploitable_max_colleges}',
				d.${DEPARTEMENTS_MAPPING.surface_exploitable_max_colleges},
				'${DEPARTEMENTS_MAPPING.potentiel_solaire_total}',
				d.${DEPARTEMENTS_MAPPING.potentiel_solaire_total},
				'${DEPARTEMENTS_MAPPING.potentiel_solaire_colleges}',
				d.${DEPARTEMENTS_MAPPING.potentiel_solaire_colleges},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_total}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_total},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_colleges},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_total}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_total},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_colleges},
				'${DEPARTEMENTS_MAPPING.nb_eleves_total}',
				d.${DEPARTEMENTS_MAPPING.nb_eleves_total},
				'${DEPARTEMENTS_MAPPING.nb_eleves_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_eleves_colleges},
				'${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_total}',
				d.${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_total},
				'${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_colleges}',
				d.${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_colleges},
				'${DEPARTEMENTS_MAPPING.top_etablissements_total}',
				d.${DEPARTEMENTS_MAPPING.top_etablissements_total},
				'${DEPARTEMENTS_MAPPING.top_etablissements_colleges}',
				d.${DEPARTEMENTS_MAPPING.top_etablissements_colleges}
				),
				'geometry', ST_AsGeoJSON(d.${DEPARTEMENTS_MAPPING.geom})::JSON
				)
			), [])
		) as geojson FROM main.${DEPARTEMENTS_TABLE} d
		` + (codeRegion ? `WHERE d.${DEPARTEMENTS_MAPPING.code_region} = $1` : ''),
		);
		if (codeRegion) {
			prepared.bindVarchar(1, codeRegion);
		}

		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch communes rows.');
	}
}

export async function fetchDepartementFeature(id: string): Promise<DepartementFeature | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${DEPARTEMENTS_MAPPING.code_departement}',
				d.${DEPARTEMENTS_MAPPING.code_departement},
				'${DEPARTEMENTS_MAPPING.libelle_departement}',
				d.${DEPARTEMENTS_MAPPING.libelle_departement},
				'${DEPARTEMENTS_MAPPING.code_region}',
				d.${DEPARTEMENTS_MAPPING.code_region},
				'${DEPARTEMENTS_MAPPING.libelle_region}',
				d.${DEPARTEMENTS_MAPPING.libelle_region},
				'${DEPARTEMENTS_MAPPING.surface_exploitable_max_total}',
				d.${DEPARTEMENTS_MAPPING.surface_exploitable_max_total},
				'${DEPARTEMENTS_MAPPING.surface_exploitable_max_colleges}',
				d.${DEPARTEMENTS_MAPPING.surface_exploitable_max_colleges},
				'${DEPARTEMENTS_MAPPING.potentiel_solaire_total}',
				d.${DEPARTEMENTS_MAPPING.potentiel_solaire_total},
				'${DEPARTEMENTS_MAPPING.potentiel_solaire_colleges}',
				d.${DEPARTEMENTS_MAPPING.potentiel_solaire_colleges},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_total}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_total},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_colleges},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_total}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_total},
				'${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_etablissements_proteges_colleges},
				'${DEPARTEMENTS_MAPPING.nb_eleves_total}',
				d.${DEPARTEMENTS_MAPPING.nb_eleves_total},
				'${DEPARTEMENTS_MAPPING.nb_eleves_colleges}',
				d.${DEPARTEMENTS_MAPPING.nb_eleves_colleges},
				'${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_total}',
				d.${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_total},
				'${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_colleges}',
				d.${DEPARTEMENTS_MAPPING.potentiel_nb_foyers_colleges},
				'${DEPARTEMENTS_MAPPING.top_etablissements_total}',
				d.${DEPARTEMENTS_MAPPING.top_etablissements_total},
				'${DEPARTEMENTS_MAPPING.top_etablissements_colleges}',
				d.${DEPARTEMENTS_MAPPING.top_etablissements_colleges}
				),
				'geometry', ST_AsGeoJSON(d.${DEPARTEMENTS_MAPPING.geom})::JSON
			) as geojson
			FROM main.${DEPARTEMENTS_TABLE} d
			WHERE d.${DEPARTEMENTS_MAPPING.code_departement} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowsJson()?.[0]?.[0];
		return result ? JSON.parse(result as string) : null;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch departements rows.');
	}
}

// --- Regions ---
export async function fetchRegionFeature(id: string): Promise<RegionFeature | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			json_object(
				'type','Feature',
				'properties',
				json_object(
				'${REGIONS_MAPPING.code_region}',
				r.${REGIONS_MAPPING.code_region},
				'${REGIONS_MAPPING.libelle_region}',
				r.${REGIONS_MAPPING.libelle_region},
				'${REGIONS_MAPPING.surface_exploitable_max_total}',
				r.${REGIONS_MAPPING.surface_exploitable_max_total},
				'${REGIONS_MAPPING.surface_exploitable_max_lycees}',
				r.${REGIONS_MAPPING.surface_exploitable_max_lycees},
				'${REGIONS_MAPPING.potentiel_solaire_total}',
				r.${REGIONS_MAPPING.potentiel_solaire_total},
				'${REGIONS_MAPPING.potentiel_solaire_lycees}',
				r.${REGIONS_MAPPING.potentiel_solaire_lycees},
				'${REGIONS_MAPPING.nb_etablissements_total}',
				r.${REGIONS_MAPPING.nb_etablissements_total},
				'${REGIONS_MAPPING.nb_etablissements_lycees}',
				r.${REGIONS_MAPPING.nb_etablissements_lycees},
				'${REGIONS_MAPPING.nb_etablissements_proteges_total}',
				r.${REGIONS_MAPPING.nb_etablissements_proteges_total},
				'${REGIONS_MAPPING.nb_etablissements_proteges_lycees}',
				r.${REGIONS_MAPPING.nb_etablissements_proteges_lycees},
				'${REGIONS_MAPPING.nb_eleves_total}',
				r.${REGIONS_MAPPING.nb_eleves_total},
				'${REGIONS_MAPPING.nb_eleves_lycees}',
				r.${REGIONS_MAPPING.nb_eleves_lycees},
				'${REGIONS_MAPPING.potentiel_nb_foyers_total}',
				r.${REGIONS_MAPPING.potentiel_nb_foyers_total},
				'${REGIONS_MAPPING.potentiel_nb_foyers_lycees}',
				r.${REGIONS_MAPPING.potentiel_nb_foyers_lycees},
				'${REGIONS_MAPPING.top_etablissements_total}',
				r.${REGIONS_MAPPING.top_etablissements_total},
				'${REGIONS_MAPPING.top_etablissements_lycees}',
				r.${REGIONS_MAPPING.top_etablissements_lycees}
				),
				'geometry', ST_AsGeoJSON(r.${REGIONS_MAPPING.geom})::JSON
			) as geojson
			FROM main.${REGIONS_TABLE} r
			WHERE r.${REGIONS_MAPPING.code_region} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowsJson()?.[0]?.[0];
		return result ? JSON.parse(result as string) : null;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch regions rows.');
	}
}

// --- Search ----

const DEFAULT_LIMIT = 10;

/**
 * Fetch results from the search view.
 * If the query is a code postal, the results will be limited to communes.
 * @param query
 * @param limit
 * @returns
 */
export async function fetchSearchResults(
	query: string,
	limit = DEFAULT_LIMIT,
): Promise<SearchResult[]> {
	try {
		const connection = await db.connect();

		let prepared;
		if (isCodePostal(query)) {
			prepared = await connection.prepare(
				`
			SELECT
			sv.${SEARCH_VIEW_MAPPING.source_table} as source, 
			sv.${SEARCH_VIEW_MAPPING.id}, 
			sv.${SEARCH_VIEW_MAPPING.libelle}, 
			sv.${SEARCH_VIEW_MAPPING.extra_data}
			FROM ${REF_CODE_POSTAL_TABLE} refCp
			INNER JOIN ${SEARCH_VIEW_TABLE} sv ON sv.${SEARCH_VIEW_MAPPING.source_table} = 'communes' AND sv.${SEARCH_VIEW_MAPPING.id} = refCp.${REF_CODE_POSTAL_MAPPING.code_insee}
			WHERE refCp.${REF_CODE_POSTAL_MAPPING.code_postal} like $1
			ORDER BY sv.${SEARCH_VIEW_MAPPING.libelle}
			LIMIT $2;
			`,
			);
			prepared.bindVarchar(1, `${query}%`);
		} else {
			prepared = await connection.prepare(
				`
			SELECT
			sv.${SEARCH_VIEW_MAPPING.source_table} as source, 
			sv.${SEARCH_VIEW_MAPPING.id}, 
			sv.${SEARCH_VIEW_MAPPING.libelle}, 
			sv.${SEARCH_VIEW_MAPPING.extra_data}
			FROM main.${SEARCH_VIEW_TABLE} sv
			WHERE sv.${SEARCH_VIEW_MAPPING.sanitized_libelle} like $1
			ORDER BY sv.${SEARCH_VIEW_MAPPING.libelle}
			LIMIT $2;
			`,
			);
			prepared.bindVarchar(1, `%${sanitizeString(query).toLowerCase()}%`);
		}
		prepared.bindInteger(2, limit);

		const reader = await prepared.runAndReadAll();
		// TODO - query data with extra_data using duckdb directly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return reader.getRowObjectsJson().map((d: any) => ({
			id: d.id,
			source: d.source,
			libelle: d.libelle,
			extra_data: 'extra_data' in d ? JSON.parse(d.extra_data) : undefined,
		})) as SearchResult[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch search view rows.');
	}
}
