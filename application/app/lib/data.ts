import { DuckDBPreparedStatement } from '@duckdb/node-api';

import { Commune, CommuneFeature, CommunesGeoJSON } from '../models/communes';
import { Departement, DepartementsGeoJSON } from '../models/departements';
import {
	Etablissement,
	EtablissementWithLatLng,
	EtablissementsGeoJSON,
} from '../models/etablissements';
import { Region } from '../models/regions';
import { SearchResult } from '../models/search';
import { isCodePostal, sanitizeString } from '../utils/string-utils';
import {
	COMMUNES_COLUMNS,
	COMMUNES_GEOJSON_MAPPING,
	COMMUNES_MAPPING,
	COMMUNES_TABLE,
	DEPARTEMENTS_COLUMNS,
	DEPARTEMENTS_GEOJSON_MAPPING,
	DEPARTEMENTS_MAPPING,
	DEPARTEMENTS_TABLE,
	ETABLISSEMENTS_COLUMNS,
	ETABLISSEMENTS_GEOJSON_MAPPING,
	ETABLISSEMENTS_MAPPING,
	ETABLISSEMENTS_TABLE,
	REF_CODE_POSTAL_COLUMNS,
	REF_CODE_POSTAL_TABLE,
	REGIONS_COLUMNS,
	REGIONS_MAPPING,
	REGIONS_TABLE,
	SEARCH_VIEW_COLUMNS,
	SEARCH_VIEW_MAPPING,
	SEARCH_VIEW_TABLE,
} from './db-mapping';
import db from './duckdb';

/**
 * Key expected in a geojson for the geometry.
 */
const GEOJSON_GEOMETRY_KEY = 'geometry';

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
export async function fetchEtablissements(
	codeCommune: string | null,
): Promise<EtablissementWithLatLng[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		let prepared: DuckDBPreparedStatement;
		if (codeCommune) {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_COLUMNS.Geometry}), ST_X(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as longitude, ST_Y(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as latitude
        FROM main.${ETABLISSEMENTS_TABLE} etab
        WHERE etab.${ETABLISSEMENTS_COLUMNS.CodeCommune} = $1;
        `,
			);
			prepared.bindVarchar(1, codeCommune);
		} else {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_COLUMNS.Geometry}), ST_X(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as longitude, ST_Y(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as latitude
        FROM main.${ETABLISSEMENTS_TABLE} etab;
        `,
			);
		}

		const reader = await prepared.runAndReadAll();
		return reader.getRowObjectsJson() as unknown as EtablissementWithLatLng[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch etablissements rows.');
	}
}

export async function fetchEtablissementsFromBoundingBox({
	southWest,
	northEast,
}: SimpleBoundingBox): Promise<EtablissementWithLatLng[]> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
        SELECT etab.* EXCLUDE (${ETABLISSEMENTS_COLUMNS.Geometry}), ST_X(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as longitude, ST_Y(etab.${ETABLISSEMENTS_COLUMNS.Geometry}) as latitude
        FROM main.${COMMUNES_TABLE} com
        INNER JOIN main.${ETABLISSEMENTS_TABLE} etab ON etab.${ETABLISSEMENTS_COLUMNS.CodeCommune} = com.${COMMUNES_COLUMNS.Id}
        WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), com.${COMMUNES_COLUMNS.Geometry});
		`,
		);
		prepared.bindDouble(1, southWest.lng);
		prepared.bindDouble(2, southWest.lat);
		prepared.bindDouble(3, northEast.lng);
		prepared.bindDouble(4, northEast.lat);
		const reader = await prepared.runAndReadAll();
		return reader.getRowObjectsJson() as unknown as EtablissementWithLatLng[];
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
						'${ETABLISSEMENTS_COLUMNS.Id}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.Id]},
						'${ETABLISSEMENTS_COLUMNS.Nom}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.Nom]},
						'${ETABLISSEMENTS_COLUMNS.CodeCommune}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.CodeCommune]},
						'${ETABLISSEMENTS_COLUMNS.CodeDepartement}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.CodeDepartement]},
						'${ETABLISSEMENTS_COLUMNS.CodeRegion}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.CodeRegion]},
						'${ETABLISSEMENTS_COLUMNS.PotentielSolaire}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.PotentielSolaire]},
						'${ETABLISSEMENTS_COLUMNS.Protection}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[ETABLISSEMENTS_COLUMNS.Protection]}
					),
					'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(e.${ETABLISSEMENTS_COLUMNS.Geometry})::JSON
					)
				), [])
			) as geojson FROM main.${ETABLISSEMENTS_TABLE} e
		` +
				(codeCommune
					? `WHERE e.${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.CodeCommune]} = $1`
					: ''),
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

export async function fetchEtablissementById(id: string): Promise<Etablissement | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			e.${ETABLISSEMENTS_COLUMNS.Id} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Id]},
			e.${ETABLISSEMENTS_COLUMNS.Nom} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Nom]},
			e.${ETABLISSEMENTS_COLUMNS.Type} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Type]},
			e.${ETABLISSEMENTS_COLUMNS.LibelleNature} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.LibelleNature]},
			e.${ETABLISSEMENTS_COLUMNS.Adresse1} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Adresse1]},
			e.${ETABLISSEMENTS_COLUMNS.Adresse2} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Adresse2]},
			e.${ETABLISSEMENTS_COLUMNS.Adresse3} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Adresse3]},
			e.${ETABLISSEMENTS_COLUMNS.CodePostal} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.CodePostal]},
			e.${ETABLISSEMENTS_COLUMNS.NbEleves} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.NbEleves]},
			e.${ETABLISSEMENTS_COLUMNS.CodeCommune} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.CodeCommune]},
			e.${ETABLISSEMENTS_COLUMNS.NomCommune} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.NomCommune]},
			e.${ETABLISSEMENTS_COLUMNS.CodeDepartement} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.CodeDepartement]},
			e.${ETABLISSEMENTS_COLUMNS.LibelleDepartement} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.LibelleDepartement]},
			e.${ETABLISSEMENTS_COLUMNS.CodeRegion} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.CodeRegion]},
			e.${ETABLISSEMENTS_COLUMNS.LibelleRegion} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.LibelleRegion]},
			e.${ETABLISSEMENTS_COLUMNS.SurfaceExploitableMax} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.SurfaceExploitableMax]},
			e.${ETABLISSEMENTS_COLUMNS.PotentielSolaire} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.PotentielSolaire]},
			e.${ETABLISSEMENTS_COLUMNS.PotentielNbFoyers} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.PotentielNbFoyers]},
			e.${ETABLISSEMENTS_COLUMNS.NiveauPotentiel} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.NiveauPotentiel]},
			e.${ETABLISSEMENTS_COLUMNS.Protection} as ${ETABLISSEMENTS_MAPPING[ETABLISSEMENTS_COLUMNS.Protection]}
			FROM main.${ETABLISSEMENTS_TABLE} e
			WHERE e.${ETABLISSEMENTS_COLUMNS.Id} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowObjectsJson()[0];
		return result ? (result as unknown as Etablissement) : null;
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
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Id]}',
				c.${COMMUNES_COLUMNS.Id},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Nom]}',
				c.${COMMUNES_COLUMNS.Nom},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeDepartement]}',
				c.${COMMUNES_COLUMNS.CodeDepartement},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeRegion]}',
				c.${COMMUNES_COLUMNS.CodeRegion},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireTotal]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireTotal},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireLycees]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireLycees},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireColleges]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireColleges},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolairePrimaires]}',
				c.${COMMUNES_COLUMNS.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${COMMUNES_COLUMNS.Geometry})::JSON
				)
			), [])
		) as geojson FROM main.${DEPARTEMENTS_TABLE} dept
		INNER JOIN main.${COMMUNES_TABLE} c ON c.${COMMUNES_COLUMNS.CodeDepartement} = dept.${DEPARTEMENTS_COLUMNS.Id}
		WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), dept.${DEPARTEMENTS_COLUMNS.Geometry});
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
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Id]}',
			c.${COMMUNES_COLUMNS.Id},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Nom]}',
			c.${COMMUNES_COLUMNS.Nom},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeDepartement]}',
			c.${COMMUNES_COLUMNS.CodeDepartement},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeRegion]}',
			c.${COMMUNES_COLUMNS.CodeRegion},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireTotal]}',
			c.${COMMUNES_COLUMNS.PotentielSolaireTotal},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireLycees]}',
			c.${COMMUNES_COLUMNS.PotentielSolaireLycees},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireColleges]}',
			c.${COMMUNES_COLUMNS.PotentielSolaireColleges},
			'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolairePrimaires]}',
			c.${COMMUNES_COLUMNS.PotentielSolairePrimaires}
			),
			'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${COMMUNES_COLUMNS.Geometry})::JSON
		) as geojson
		FROM main.${COMMUNES_TABLE} c
		WHERE ST_CONTAINS(c.${COMMUNES_COLUMNS.Geometry}, ST_POINT($1, $2))`,
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
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Id]}',
				c.${COMMUNES_COLUMNS.Id},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.Nom]}',
				c.${COMMUNES_COLUMNS.Nom},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeDepartement]}',
				c.${COMMUNES_COLUMNS.CodeDepartement},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.CodeRegion]}',
				c.${COMMUNES_COLUMNS.CodeRegion},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireTotal]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireTotal},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireLycees]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireLycees},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolaireColleges]}',
				c.${COMMUNES_COLUMNS.PotentielSolaireColleges},
				'${COMMUNES_GEOJSON_MAPPING[COMMUNES_COLUMNS.PotentielSolairePrimaires]}',
				c.${COMMUNES_COLUMNS.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${COMMUNES_COLUMNS.Geometry})::JSON
				)
			), [])
		) as geojson FROM main.${COMMUNES_TABLE} c
		` + (codeDepartement ? `WHERE c.${COMMUNES_COLUMNS.CodeDepartement} = $1` : ''),
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

export async function fetchCommuneById(id: string): Promise<Commune | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			c.${COMMUNES_COLUMNS.Id} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.Id]},
			c.${COMMUNES_COLUMNS.Nom} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.Nom]},
			c.${COMMUNES_COLUMNS.CodeDepartement} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.CodeDepartement]},
			c.${COMMUNES_COLUMNS.LibelleDepartement} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.LibelleDepartement]},
			c.${COMMUNES_COLUMNS.CodeRegion} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.CodeRegion]},
			c.${COMMUNES_COLUMNS.LibelleRegion} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.LibelleRegion]},
			c.${COMMUNES_COLUMNS.SurfaceExploitableMaxTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.SurfaceExploitableMaxTotal]},
			c.${COMMUNES_COLUMNS.SurfaceExploitableMaxPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.SurfaceExploitableMaxPrimaires]},
			c.${COMMUNES_COLUMNS.PotentielSolaireTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.PotentielSolaireTotal]},
			c.${COMMUNES_COLUMNS.PotentielSolairePrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.PotentielSolairePrimaires]},
			c.${COMMUNES_COLUMNS.NbEtablissementsTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsTotal]},
			c.${COMMUNES_COLUMNS.NbEtablissementsPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsPrimaires]},
			c.${COMMUNES_COLUMNS.NbEtablissementsProtegesTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsProtegesTotal]},
			c.${COMMUNES_COLUMNS.NbEtablissementsProtegesPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsProtegesPrimaires]},
			c.${COMMUNES_COLUMNS.NbElevesTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbElevesTotal]},
			c.${COMMUNES_COLUMNS.NbElevesPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbElevesPrimaires]},
			c.${COMMUNES_COLUMNS.PotentielNbFoyersTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.PotentielNbFoyersTotal]},
			c.${COMMUNES_COLUMNS.PotentielNbFoyersPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.PotentielNbFoyersPrimaires]},
			c.${COMMUNES_COLUMNS.TopEtablissementsTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.TopEtablissementsTotal]},
			c.${COMMUNES_COLUMNS.TopEtablissementsPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.TopEtablissementsPrimaires]},
			c.${COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielTotal} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielTotal]},
			c.${COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielPrimaires} as ${COMMUNES_MAPPING[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielPrimaires]}
			FROM main.${COMMUNES_TABLE} c
			WHERE c.${COMMUNES_COLUMNS.Id} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowObjectsJson()[0];
		if (!result) {
			return null;
		}
		// TODO: check if duckdb can do this
		return {
			...result,
			top_etablissements_total: JSON.parse(result.top_etablissements_total as string),
			top_etablissements_primaires: JSON.parse(result.top_etablissements_primaires as string),
			nb_etablissements_par_niveau_potentiel_total: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_total as string,
			),
			nb_etablissements_par_niveau_potentiel_primaires: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_primaires as string,
			),
		} as Commune;
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
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.Id]}',
				d.${DEPARTEMENTS_COLUMNS.Id},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.Nom]}',
				d.${DEPARTEMENTS_COLUMNS.Nom},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.CodeRegion]}',
				d.${DEPARTEMENTS_COLUMNS.CodeRegion},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]}',
				d.${DEPARTEMENTS_COLUMNS.PotentielSolaireTotal},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolaireLycees]}',
				d.${DEPARTEMENTS_COLUMNS.PotentielSolaireLycees},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]}',
				d.${DEPARTEMENTS_COLUMNS.PotentielSolaireColleges},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolairePrimaires]}',
				d.${DEPARTEMENTS_COLUMNS.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(d.${DEPARTEMENTS_COLUMNS.Geometry})::JSON
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

export async function fetchDepartementById(id: string): Promise<Departement | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			d.${DEPARTEMENTS_COLUMNS.Id} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.Id]},
			d.${DEPARTEMENTS_COLUMNS.Nom} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.Nom]},
			d.${DEPARTEMENTS_COLUMNS.CodeRegion} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.CodeRegion]},
			d.${DEPARTEMENTS_COLUMNS.LibelleRegion} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.LibelleRegion]},
			d.${DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxTotal]},
			d.${DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxColleges]},
			d.${DEPARTEMENTS_COLUMNS.PotentielSolaireTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]},
			d.${DEPARTEMENTS_COLUMNS.PotentielSolaireColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsTotal]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsColleges]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesTotal]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesColleges]},
			d.${DEPARTEMENTS_COLUMNS.NbElevesTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbElevesTotal]},
			d.${DEPARTEMENTS_COLUMNS.NbElevesColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbElevesColleges]},
			d.${DEPARTEMENTS_COLUMNS.PotentielNbFoyersTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.PotentielNbFoyersTotal]},
			d.${DEPARTEMENTS_COLUMNS.PotentielNbFoyersColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.PotentielNbFoyersColleges]},
			d.${DEPARTEMENTS_COLUMNS.TopEtablissementsTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.TopEtablissementsTotal]},
			d.${DEPARTEMENTS_COLUMNS.TopEtablissementsColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.TopEtablissementsColleges]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielTotal} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]},
			d.${DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielColleges} as ${DEPARTEMENTS_MAPPING[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielColleges]}
			FROM main.${DEPARTEMENTS_TABLE} d
			WHERE d.${DEPARTEMENTS_COLUMNS.Id} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowObjectsJson()[0];
		if (!result) {
			return null;
		}
		// TODO: check if duckdb can do this
		return {
			...result,
			top_etablissements_total: JSON.parse(result.top_etablissements_total as string),
			top_etablissements_colleges: JSON.parse(result.top_etablissements_colleges as string),
			nb_etablissements_par_niveau_potentiel_total: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_total as string,
			),
			nb_etablissements_par_niveau_potentiel_colleges: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_colleges as string,
			),
		} as Departement;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch departements rows.');
	}
}

// --- Regions ---
export async function fetchRegionById(id: string): Promise<Region | null> {
	try {
		const connection = await db.connect();
		await connection.run('LOAD SPATIAL;');

		const prepared = await connection.prepare(
			`
			SELECT
			r.${REGIONS_COLUMNS.Id} as ${REGIONS_MAPPING[REGIONS_COLUMNS.Id]},
			r.${REGIONS_COLUMNS.Nom} as ${REGIONS_MAPPING[REGIONS_COLUMNS.Nom]},
			r.${REGIONS_COLUMNS.SurfaceExploitableMaxTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.SurfaceExploitableMaxTotal]},
			r.${REGIONS_COLUMNS.SurfaceExploitableMaxLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.SurfaceExploitableMaxLycees]},
			r.${REGIONS_COLUMNS.PotentielSolaireTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.PotentielSolaireTotal]},
			r.${REGIONS_COLUMNS.PotentielSolaireLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.PotentielSolaireLycees]},
			r.${REGIONS_COLUMNS.NbEtablissementsTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsTotal]},
			r.${REGIONS_COLUMNS.NbEtablissementsLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsLycees]},
			r.${REGIONS_COLUMNS.NbEtablissementsProtegesTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsProtegesTotal]},
			r.${REGIONS_COLUMNS.NbEtablissementsProtegesLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsProtegesLycees]},
			r.${REGIONS_COLUMNS.NbElevesTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbElevesTotal]},
			r.${REGIONS_COLUMNS.NbElevesLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbElevesLycees]},
			r.${REGIONS_COLUMNS.PotentielNbFoyersTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.PotentielNbFoyersTotal]},
			r.${REGIONS_COLUMNS.PotentielNbFoyersLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.PotentielNbFoyersLycees]},
			r.${REGIONS_COLUMNS.TopEtablissementsTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.TopEtablissementsTotal]},
			r.${REGIONS_COLUMNS.TopEtablissementsLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.TopEtablissementsLycees]},
			r.${REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielTotal} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]},
			r.${REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielLycees} as ${REGIONS_MAPPING[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielLycees]}
			FROM main.${REGIONS_TABLE} r
			WHERE r.${REGIONS_COLUMNS.Id} = $1
		`,
		);
		prepared.bindVarchar(1, id);

		const reader = await prepared.runAndReadAll();
		const result = reader.getRowObjectsJson()[0];
		if (!result) {
			return null;
		}
		// TODO: check if duckdb can do this
		return {
			...result,
			top_etablissements_total: JSON.parse(result.top_etablissements_total as string),
			top_etablissements_lycees: JSON.parse(result.top_etablissements_lycees as string),
			nb_etablissements_par_niveau_potentiel_total: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_total as string,
			),
			nb_etablissements_par_niveau_potentiel_lycees: JSON.parse(
				result.nb_etablissements_par_niveau_potentiel_lycees as string,
			),
		} as Region;
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
			sv.${SEARCH_VIEW_COLUMNS.Source} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Source]}, 
			sv.${SEARCH_VIEW_COLUMNS.Id} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Id]}, 
			sv.${SEARCH_VIEW_COLUMNS.Libelle} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Libelle]}, 
			sv.${SEARCH_VIEW_COLUMNS.ExtraData} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.ExtraData]}
			FROM ${REF_CODE_POSTAL_TABLE} refCp
			INNER JOIN ${SEARCH_VIEW_TABLE} sv ON sv.${SEARCH_VIEW_COLUMNS.Source} = 'communes' AND sv.${SEARCH_VIEW_COLUMNS.Id} = refCp.${REF_CODE_POSTAL_COLUMNS.CodeInsee}
			WHERE refCp.${REF_CODE_POSTAL_COLUMNS.CodePostal} like $1
			ORDER BY sv.${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Libelle]}
			LIMIT $2;
			`,
			);
			prepared.bindVarchar(1, `${query}%`);
		} else {
			prepared = await connection.prepare(
				`
			SELECT
			sv.${SEARCH_VIEW_COLUMNS.Source} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Source]}, 
			sv.${SEARCH_VIEW_COLUMNS.Id} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Id]}, 
			sv.${SEARCH_VIEW_COLUMNS.Libelle} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.Libelle]}, 
			sv.${SEARCH_VIEW_COLUMNS.ExtraData} as ${SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.ExtraData]}
			FROM main.${SEARCH_VIEW_TABLE} sv
			WHERE sv.${SEARCH_VIEW_COLUMNS.SanitizedLibelle} like $1
			ORDER BY sv.${SEARCH_VIEW_COLUMNS.Libelle}
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
			extra_data:
				SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.ExtraData] in d
					? JSON.parse(d[SEARCH_VIEW_MAPPING[SEARCH_VIEW_COLUMNS.ExtraData]])
					: undefined,
		})) as SearchResult[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch search view rows.');
	}
}
