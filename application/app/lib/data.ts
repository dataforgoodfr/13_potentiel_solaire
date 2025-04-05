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
import db from './duckdb';

// --- Etablissements ---
export async function fetchEtablissements(codeCommune: string | null): Promise<Etablissement[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		let prepared: DuckDBPreparedStatement;
		if (codeCommune) {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (geom), ST_X(etab.geom) as longitude, ST_Y(etab.geom) as latitude
        FROM main.etablissements etab
        WHERE etab.code_commune = $1;
        `,
			);
			prepared.bindVarchar(1, codeCommune);
		} else {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (geom), ST_X(etab.geom) as longitude, ST_Y(etab.geom) as latitude
        FROM main.etablissements etab;
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
}: {
	southWest: { lat: number; lng: number };
	northEast: { lat: number; lng: number };
}): Promise<Etablissement[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
        SELECT etab.* EXCLUDE (geom), ST_X(etab.geom) as longitude, ST_Y(etab.geom) as latitude
        FROM main.communes com
        INNER JOIN main.etablissements etab ON etab.code_commune = com.code_commune
        WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), com.geom);
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
						'identifiant_de_l_etablissement',
						e.identifiant_de_l_etablissement,
						'nom_etablissement',
						e.nom_etablissement,
						'type_etablissement',
						e.type_etablissement,
						'libelle_nature',
						e.libelle_nature,
						'adresse_1',
						e.adresse_1,
						'adresse_2',
						e.adresse_2,
						'adresse_3',
						e.adresse_3,
						'code_postal',
						e.code_postal,
						'nb_eleves',
						e.nb_eleves,
						'code_commune',
						e.code_commune,
						'nom_commune',
						e.nom_commune,
						'code_departement',
						e.code_departement,
						'libelle_departement',
						e.libelle_departement,
						'code_region',
						e.code_region,
						'libelle_region',
						e.libelle_region,
						'surface_utile',
						e.surface_utile,
						'potentiel_solaire',
						e.potentiel_solaire,
						'protection',
						e.protection
					),
					'geometry', ST_AsGeoJSON(e.geom)::JSON
					)
				), [])
			) as geojson FROM main.etablissements e
		` + (codeCommune ? 'WHERE e.code_commune = $1' : ''),
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
					'identifiant_de_l_etablissement',
					e.identifiant_de_l_etablissement,
					'nom_etablissement',
					e.nom_etablissement,
					'type_etablissement',
					e.type_etablissement,
					'libelle_nature',
					e.libelle_nature,
					'adresse_1',
					e.adresse_1,
					'adresse_2',
					e.adresse_2,
					'adresse_3',
					e.adresse_3,
					'code_postal',
					e.code_postal,
					'nb_eleves',
					e.nb_eleves,
					'code_commune',
					e.code_commune,
					'nom_commune',
					e.nom_commune,
					'code_departement',
					e.code_departement,
					'libelle_departement',
					e.libelle_departement,
					'code_region',
					e.code_region,
					'libelle_region',
					e.libelle_region,
					'surface_utile',
					e.surface_utile,
					'potentiel_solaire',
					e.potentiel_solaire,
					'protection',
					e.protection
				),
				'geometry', ST_AsGeoJSON(e.geom)::JSON
			) as geojson
			FROM main.etablissements e
			WHERE e.identifiant_de_l_etablissement = $1
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
}: {
	southWest: { lat: number; lng: number };
	northEast: { lat: number; lng: number };
}): Promise<CommunesGeoJSON> {
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
				'code_commune',
				c.code_commune,
				'nom_commune',
				c.nom_commune,
				'code_departement',
				c.code_departement,
				'libelle_departement',
				c.libelle_departement,
				'code_region',
				c.code_region,
				'libelle_region',
				c.libelle_region,
				'surface_utile',
				c.surface_utile,
				'potentiel_solaire',
				c.potentiel_solaire,
				'count_etablissements',
				c.count_etablissements,
				'count_etablissements_proteges',
				c.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(c.geom)::JSON
				)
			), [])
		) as geojson FROM main.departements dept
		INNER JOIN main.communes c ON c.code_departement = dept.code_departement
		WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), dept.geom);
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
				'code_commune',
				c.code_commune,
				'nom_commune',
				c.nom_commune,
				'code_departement',
				c.code_departement,
				'libelle_departement',
				c.libelle_departement,
				'code_region',
				c.code_region,
				'libelle_region',
				c.libelle_region,
				'surface_utile',
				c.surface_utile,
				'potentiel_solaire',
				c.potentiel_solaire,
				'count_etablissements',
				c.count_etablissements,
				'count_etablissements_proteges',
				c.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(c.geom)::JSON
				)
			), [])
		) as geojson FROM main.communes c
		` + (codeDepartement ? 'WHERE c.code_departement = $1' : ''),
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

export async function fetchCommuneGeoJSONById(id: string): Promise<CommuneFeature | null> {
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
				'code_commune',
				c.code_commune,
				'nom_commune',
				c.nom_commune,
				'code_departement',
				c.code_departement,
				'libelle_departement',
				c.libelle_departement,
				'code_region',
				c.code_region,
				'libelle_region',
				c.libelle_region,
				'surface_utile',
				c.surface_utile,
				'potentiel_solaire',
				c.potentiel_solaire,
				'count_etablissements',
				c.count_etablissements,
				'count_etablissements_proteges',
				c.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(c.geom)::JSON
			) as geojson
			FROM main.communes c
			WHERE c.code_commune = $1
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
				'code_departement',
				d.code_departement,
				'libelle_departement',
				d.libelle_departement,
				'code_region',
				d.code_region,
				'libelle_region',
				d.libelle_region,
				'surface_utile',
				d.surface_utile,
				'potentiel_solaire',
				d.potentiel_solaire,
				'count_etablissements',
				d.count_etablissements,
				'count_etablissements_proteges',
				d.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(d.geom)::JSON
				)
			), [])
		) as geojson FROM main.departements d
		` + (codeRegion ? 'WHERE d.code_region = $1' : ''),
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

export async function fetchDepartementGeoJSONById(id: string): Promise<DepartementFeature | null> {
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
				'code_departement',
				d.code_departement,
				'libelle_departement',
				d.libelle_departement,
				'code_region',
				d.code_region,
				'libelle_region',
				d.libelle_region,
				'surface_utile',
				d.surface_utile,
				'potentiel_solaire',
				d.potentiel_solaire,
				'count_etablissements',
				d.count_etablissements,
				'count_etablissements_proteges',
				d.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(d.geom)::JSON
			) as geojson
			FROM main.departements d
			WHERE d.code_departement = $1
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
export async function fetchRegionGeoJSONById(id: string): Promise<RegionFeature | null> {
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
				'code_region',
				r.code_region,
				'libelle_region',
				r.libelle_region,
				'surface_utile',
				r.surface_utile,
				'potentiel_solaire',
				r.potentiel_solaire,
				'count_etablissements',
				r.count_etablissements,
				'count_etablissements_proteges',
				r.count_etablissements_proteges
				),
				'geometry', ST_AsGeoJSON(r.geom)::JSON
			) as geojson
			FROM main.regions r
			WHERE r.code_region = $1
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
			SELECT sv.source_table as source, sv.id, sv.libelle, sv.extra_data
			FROM ref_code_postal refCp
			INNER JOIN search_view sv ON sv.source_table = 'communes' AND sv.id = refCp.code_insee
			WHERE refCp.code_postal like $1
			ORDER BY sv.libelle
			LIMIT $2;
			`,
			);
			prepared.bindVarchar(1, `${query}%`);
		} else {
			prepared = await connection.prepare(
				`
			SELECT source_table as source, id, libelle, extra_data
			FROM main.search_view sv
			WHERE sv.sanitized_libelle like $1
			ORDER BY sv.libelle
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
