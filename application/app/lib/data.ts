import { DuckDBPreparedStatement } from '@duckdb/node-api';

import {
	Commune,
	CommuneFeature,
	CommunePropertiesKeys,
	CommunesGeoJSON,
} from '../models/communes';
import {
	Departement,
	DepartementPropertiesKeys,
	DepartementsGeoJSON,
} from '../models/departements';
import {
	Etablissement,
	EtablissementWithLatLng,
	EtablissementsGeoJSON,
} from '../models/etablissements';
import { Region, RegionPropertiesKeys } from '../models/regions';
import { SearchPropertiesKeys, SearchResult } from '../models/search';
import { isCodePostal, sanitizeString } from '../utils/string-utils';
import {
	COMMUNES_GEOJSON_MAPPING,
	COMMUNES_MAPPING,
	COMMUNES_TABLE,
	CommunesColumns,
	DEPARTEMENTS_GEOJSON_MAPPING,
	DEPARTEMENTS_MAPPING,
	DEPARTEMENTS_TABLE,
	DepartementsColumns,
	ETABLISSEMENTS_GEOJSON_MAPPING,
	ETABLISSEMENTS_MAPPING,
	ETABLISSEMENTS_TABLE,
	EtablissementsColumns,
	REF_CODE_POSTAL_TABLE,
	REGIONS_MAPPING,
	REGIONS_TABLE,
	RefCodePostalColumns,
	RegionsColumns,
	SEARCH_VIEW_MAPPING,
	SEARCH_VIEW_TABLE,
	SearchViewColumns,
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
        SELECT etab.* EXCLUDE (${EtablissementsColumns.Geometry}), ST_X(etab.${EtablissementsColumns.Geometry}) as longitude, ST_Y(etab.${EtablissementsColumns.Geometry}) as latitude
        FROM main.${ETABLISSEMENTS_TABLE} etab
        WHERE etab.${EtablissementsColumns.CodeCommune} = $1;
        `,
			);
			prepared.bindVarchar(1, codeCommune);
		} else {
			prepared = await connection.prepare(
				`
        SELECT etab.* EXCLUDE (${EtablissementsColumns.Geometry}), ST_X(etab.${EtablissementsColumns.Geometry}) as longitude, ST_Y(etab.${EtablissementsColumns.Geometry}) as latitude
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
        SELECT etab.* EXCLUDE (${EtablissementsColumns.Geometry}), ST_X(etab.${EtablissementsColumns.Geometry}) as longitude, ST_Y(etab.${EtablissementsColumns.Geometry}) as latitude
        FROM main.${COMMUNES_TABLE} com
        INNER JOIN main.${ETABLISSEMENTS_TABLE} etab ON etab.${EtablissementsColumns.CodeCommune} = com.${CommunesColumns.Id}
        WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), com.${CommunesColumns.Geometry});
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
						'${EtablissementsColumns.Id}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.Id]},
						'${EtablissementsColumns.Nom}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.Nom]},
						'${EtablissementsColumns.CodeCommune}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.CodeCommune]},
						'${EtablissementsColumns.CodeDepartement}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.CodeDepartement]},
						'${EtablissementsColumns.CodeRegion}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.CodeRegion]},
						'${EtablissementsColumns.PotentielSolaire}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.PotentielSolaire]},
						'${EtablissementsColumns.Protection}',
						e.${ETABLISSEMENTS_GEOJSON_MAPPING[EtablissementsColumns.Protection]}
					),
					'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(e.${EtablissementsColumns.Geometry})::JSON
					)
				), [])
			) as geojson FROM main.${ETABLISSEMENTS_TABLE} e
		` +
				(codeCommune
					? `WHERE e.${ETABLISSEMENTS_MAPPING[EtablissementsColumns.CodeCommune]} = $1`
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
			e.${EtablissementsColumns.Id} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Id]},
			e.${EtablissementsColumns.Nom} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Nom]},
			e.${EtablissementsColumns.Type} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Type]},
			e.${EtablissementsColumns.LibelleNature} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.LibelleNature]},
			e.${EtablissementsColumns.Adresse1} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Adresse1]},
			e.${EtablissementsColumns.Adresse2} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Adresse2]},
			e.${EtablissementsColumns.Adresse3} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Adresse3]},
			e.${EtablissementsColumns.CodePostal} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.CodePostal]},
			e.${EtablissementsColumns.NbEleves} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.NbEleves]},
			e.${EtablissementsColumns.CodeCommune} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.CodeCommune]},
			e.${EtablissementsColumns.NomCommune} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.NomCommune]},
			e.${EtablissementsColumns.CodeDepartement} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.CodeDepartement]},
			e.${EtablissementsColumns.LibelleDepartement} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.LibelleDepartement]},
			e.${EtablissementsColumns.CodeRegion} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.CodeRegion]},
			e.${EtablissementsColumns.LibelleRegion} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.LibelleRegion]},
			e.${EtablissementsColumns.SurfaceExploitableMax} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.SurfaceExploitableMax]},
			e.${EtablissementsColumns.PotentielSolaire} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.PotentielSolaire]},
			e.${EtablissementsColumns.PotentielNbFoyers} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.PotentielNbFoyers]},
			e.${EtablissementsColumns.NiveauPotentiel} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.NiveauPotentiel]},
			e.${EtablissementsColumns.Protection} as ${ETABLISSEMENTS_MAPPING[EtablissementsColumns.Protection]}
			FROM main.${ETABLISSEMENTS_TABLE} e
			WHERE e.${EtablissementsColumns.Id} = $1
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
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Id]}',
				c.${CommunesColumns.Id},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Nom]}',
				c.${CommunesColumns.Nom},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeDepartement]}',
				c.${CommunesColumns.CodeDepartement},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeRegion]}',
				c.${CommunesColumns.CodeRegion},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireTotal]}',
				c.${CommunesColumns.PotentielSolaireTotal},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireLycees]}',
				c.${CommunesColumns.PotentielSolaireLycees},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireColleges]}',
				c.${CommunesColumns.PotentielSolaireColleges},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolairePrimaires]}',
				c.${CommunesColumns.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${CommunesColumns.Geometry})::JSON
				)
			), [])
		) as geojson FROM main.${DEPARTEMENTS_TABLE} dept
		INNER JOIN main.${COMMUNES_TABLE} c ON c.${CommunesColumns.CodeDepartement} = dept.${DepartementsColumns.Id}
		WHERE ST_Intersects(ST_MakeEnvelope($1, $2, $3, $4), dept.${DepartementsColumns.Geometry});
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
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Id]}',
			c.${CommunesColumns.Id},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Nom]}',
			c.${CommunesColumns.Nom},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeDepartement]}',
			c.${CommunesColumns.CodeDepartement},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeRegion]}',
			c.${CommunesColumns.CodeRegion},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireTotal]}',
			c.${CommunesColumns.PotentielSolaireTotal},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireLycees]}',
			c.${CommunesColumns.PotentielSolaireLycees},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireColleges]}',
			c.${CommunesColumns.PotentielSolaireColleges},
			'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolairePrimaires]}',
			c.${CommunesColumns.PotentielSolairePrimaires}
			),
			'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${CommunesColumns.Geometry})::JSON
		) as geojson
		FROM main.${COMMUNES_TABLE} c
		WHERE ST_CONTAINS(c.${CommunesColumns.Geometry}, ST_POINT($1, $2))`,
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
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Id]}',
				c.${CommunesColumns.Id},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.Nom]}',
				c.${CommunesColumns.Nom},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeDepartement]}',
				c.${CommunesColumns.CodeDepartement},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.CodeRegion]}',
				c.${CommunesColumns.CodeRegion},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireTotal]}',
				c.${CommunesColumns.PotentielSolaireTotal},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireLycees]}',
				c.${CommunesColumns.PotentielSolaireLycees},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolaireColleges]}',
				c.${CommunesColumns.PotentielSolaireColleges},
				'${COMMUNES_GEOJSON_MAPPING[CommunesColumns.PotentielSolairePrimaires]}',
				c.${CommunesColumns.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(c.${CommunesColumns.Geometry})::JSON
				)
			), [])
		) as geojson FROM main.${COMMUNES_TABLE} c
		` + (codeDepartement ? `WHERE c.${CommunesColumns.CodeDepartement} = $1` : ''),
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
			c.${CommunesColumns.Id} as ${COMMUNES_MAPPING[CommunesColumns.Id]},
			c.${CommunesColumns.Nom} as ${COMMUNES_MAPPING[CommunesColumns.Nom]},
			c.${CommunesColumns.CodeDepartement} as ${COMMUNES_MAPPING[CommunesColumns.CodeDepartement]},
			c.${CommunesColumns.LibelleDepartement} as ${COMMUNES_MAPPING[CommunesColumns.LibelleDepartement]},
			c.${CommunesColumns.CodeRegion} as ${COMMUNES_MAPPING[CommunesColumns.CodeRegion]},
			c.${CommunesColumns.LibelleRegion} as ${COMMUNES_MAPPING[CommunesColumns.LibelleRegion]},
			c.${CommunesColumns.SurfaceExploitableMaxTotal} as ${COMMUNES_MAPPING[CommunesColumns.SurfaceExploitableMaxTotal]},
			c.${CommunesColumns.SurfaceExploitableMaxPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.SurfaceExploitableMaxPrimaires]},
			c.${CommunesColumns.PotentielSolaireTotal} as ${COMMUNES_MAPPING[CommunesColumns.PotentielSolaireTotal]},
			c.${CommunesColumns.PotentielSolairePrimaires} as ${COMMUNES_MAPPING[CommunesColumns.PotentielSolairePrimaires]},
			c.${CommunesColumns.NbEtablissementsTotal} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsTotal]},
			c.${CommunesColumns.NbEtablissementsPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsPrimaires]},
			c.${CommunesColumns.NbEtablissementsProtegesTotal} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsProtegesTotal]},
			c.${CommunesColumns.NbEtablissementsProtegesPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsProtegesPrimaires]},
			c.${CommunesColumns.NbElevesTotal} as ${COMMUNES_MAPPING[CommunesColumns.NbElevesTotal]},
			c.${CommunesColumns.NbElevesPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.NbElevesPrimaires]},
			c.${CommunesColumns.PotentielNbFoyersTotal} as ${COMMUNES_MAPPING[CommunesColumns.PotentielNbFoyersTotal]},
			c.${CommunesColumns.PotentielNbFoyersPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.PotentielNbFoyersPrimaires]},
			c.${CommunesColumns.TopEtablissementsTotal} as ${COMMUNES_MAPPING[CommunesColumns.TopEtablissementsTotal]},
			c.${CommunesColumns.TopEtablissementsPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.TopEtablissementsPrimaires]},
			c.${CommunesColumns.NbEtablissementsParNiveauPotentielTotal} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsParNiveauPotentielTotal]},
			c.${CommunesColumns.NbEtablissementsParNiveauPotentielPrimaires} as ${COMMUNES_MAPPING[CommunesColumns.NbEtablissementsParNiveauPotentielPrimaires]}
			FROM main.${COMMUNES_TABLE} c
			WHERE c.${CommunesColumns.Id} = $1
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
			[CommunePropertiesKeys.TopEtablissementsTotal]: JSON.parse(
				result[CommunePropertiesKeys.TopEtablissementsTotal] as string,
			),
			[CommunePropertiesKeys.TopEtablissementsPrimaires]: JSON.parse(
				result[CommunePropertiesKeys.TopEtablissementsPrimaires] as string,
			),
			[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: JSON.parse(
				result[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielTotal] as string,
			),
			[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielPrimaires]: JSON.parse(
				result[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielPrimaires] as string,
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
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.Id]}',
				d.${DepartementsColumns.Id},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.Nom]}',
				d.${DepartementsColumns.Nom},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.CodeRegion]}',
				d.${DepartementsColumns.CodeRegion},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.PotentielSolaireTotal]}',
				d.${DepartementsColumns.PotentielSolaireTotal},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.PotentielSolaireLycees]}',
				d.${DepartementsColumns.PotentielSolaireLycees},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.PotentielSolaireColleges]}',
				d.${DepartementsColumns.PotentielSolaireColleges},
				'${DEPARTEMENTS_GEOJSON_MAPPING[DepartementsColumns.PotentielSolairePrimaires]}',
				d.${DepartementsColumns.PotentielSolairePrimaires}
				),
				'${GEOJSON_GEOMETRY_KEY}', ST_AsGeoJSON(d.${DepartementsColumns.Geometry})::JSON
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
			d.${DepartementsColumns.Id} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.Id]},
			d.${DepartementsColumns.Nom} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.Nom]},
			d.${DepartementsColumns.CodeRegion} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.CodeRegion]},
			d.${DepartementsColumns.LibelleRegion} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.LibelleRegion]},
			d.${DepartementsColumns.SurfaceExploitableMaxTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.SurfaceExploitableMaxTotal]},
			d.${DepartementsColumns.SurfaceExploitableMaxColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.SurfaceExploitableMaxColleges]},
			d.${DepartementsColumns.PotentielSolaireTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.PotentielSolaireTotal]},
			d.${DepartementsColumns.PotentielSolaireColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.PotentielSolaireColleges]},
			d.${DepartementsColumns.NbEtablissementsTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsTotal]},
			d.${DepartementsColumns.NbEtablissementsColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsColleges]},
			d.${DepartementsColumns.NbEtablissementsProtegesTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsProtegesTotal]},
			d.${DepartementsColumns.NbEtablissementsProtegesColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsProtegesColleges]},
			d.${DepartementsColumns.NbElevesTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbElevesTotal]},
			d.${DepartementsColumns.NbElevesColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbElevesColleges]},
			d.${DepartementsColumns.PotentielNbFoyersTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.PotentielNbFoyersTotal]},
			d.${DepartementsColumns.PotentielNbFoyersColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.PotentielNbFoyersColleges]},
			d.${DepartementsColumns.TopEtablissementsTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.TopEtablissementsTotal]},
			d.${DepartementsColumns.TopEtablissementsColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.TopEtablissementsColleges]},
			d.${DepartementsColumns.NbEtablissementsParNiveauPotentielTotal} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsParNiveauPotentielTotal]},
			d.${DepartementsColumns.NbEtablissementsParNiveauPotentielColleges} as ${DEPARTEMENTS_MAPPING[DepartementsColumns.NbEtablissementsParNiveauPotentielColleges]}
			FROM main.${DEPARTEMENTS_TABLE} d
			WHERE d.${DepartementsColumns.Id} = $1
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
			[DepartementPropertiesKeys.TopEtablissementsTotal]: JSON.parse(
				result[DepartementPropertiesKeys.TopEtablissementsTotal] as string,
			),
			[DepartementPropertiesKeys.TopEtablissementsColleges]: JSON.parse(
				result[DepartementPropertiesKeys.TopEtablissementsColleges] as string,
			),
			[DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: JSON.parse(
				result[DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielTotal] as string,
			),
			[DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielColleges]: JSON.parse(
				result[
					DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielColleges
				] as string,
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
			r.${RegionsColumns.Id} as ${REGIONS_MAPPING[RegionsColumns.Id]},
			r.${RegionsColumns.Nom} as ${REGIONS_MAPPING[RegionsColumns.Nom]},
			r.${RegionsColumns.SurfaceExploitableMaxTotal} as ${REGIONS_MAPPING[RegionsColumns.SurfaceExploitableMaxTotal]},
			r.${RegionsColumns.SurfaceExploitableMaxLycees} as ${REGIONS_MAPPING[RegionsColumns.SurfaceExploitableMaxLycees]},
			r.${RegionsColumns.PotentielSolaireTotal} as ${REGIONS_MAPPING[RegionsColumns.PotentielSolaireTotal]},
			r.${RegionsColumns.PotentielSolaireLycees} as ${REGIONS_MAPPING[RegionsColumns.PotentielSolaireLycees]},
			r.${RegionsColumns.NbEtablissementsTotal} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsTotal]},
			r.${RegionsColumns.NbEtablissementsLycees} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsLycees]},
			r.${RegionsColumns.NbEtablissementsProtegesTotal} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsProtegesTotal]},
			r.${RegionsColumns.NbEtablissementsProtegesLycees} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsProtegesLycees]},
			r.${RegionsColumns.NbElevesTotal} as ${REGIONS_MAPPING[RegionsColumns.NbElevesTotal]},
			r.${RegionsColumns.NbElevesLycees} as ${REGIONS_MAPPING[RegionsColumns.NbElevesLycees]},
			r.${RegionsColumns.PotentielNbFoyersTotal} as ${REGIONS_MAPPING[RegionsColumns.PotentielNbFoyersTotal]},
			r.${RegionsColumns.PotentielNbFoyersLycees} as ${REGIONS_MAPPING[RegionsColumns.PotentielNbFoyersLycees]},
			r.${RegionsColumns.TopEtablissementsTotal} as ${REGIONS_MAPPING[RegionsColumns.TopEtablissementsTotal]},
			r.${RegionsColumns.TopEtablissementsLycees} as ${REGIONS_MAPPING[RegionsColumns.TopEtablissementsLycees]},
			r.${RegionsColumns.NbEtablissementsParNiveauPotentielTotal} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsParNiveauPotentielTotal]},
			r.${RegionsColumns.NbEtablissementsParNiveauPotentielLycees} as ${REGIONS_MAPPING[RegionsColumns.NbEtablissementsParNiveauPotentielLycees]}
			FROM main.${REGIONS_TABLE} r
			WHERE r.${RegionsColumns.Id} = $1
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
			[RegionPropertiesKeys.TopEtablissementsTotal]: JSON.parse(
				result[RegionPropertiesKeys.TopEtablissementsTotal] as string,
			),
			[RegionPropertiesKeys.TopEtablissementsLycees]: JSON.parse(
				result[RegionPropertiesKeys.TopEtablissementsLycees] as string,
			),
			[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: JSON.parse(
				result[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielTotal] as string,
			),
			[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielLycees]: JSON.parse(
				result[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielLycees] as string,
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
			sv.${SearchViewColumns.Source} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Source]}, 
			sv.${SearchViewColumns.Id} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Id]}, 
			sv.${SearchViewColumns.Libelle} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Libelle]}, 
			sv.${SearchViewColumns.ExtraData} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.ExtraData]}
			FROM ${REF_CODE_POSTAL_TABLE} refCp
			INNER JOIN ${SEARCH_VIEW_TABLE} sv ON sv.${SearchViewColumns.Source} = 'communes' AND sv.${SearchViewColumns.Id} = refCp.${RefCodePostalColumns.CodeInsee}
			WHERE refCp.${RefCodePostalColumns.CodePostal} like $1
			ORDER BY sv.${SearchPropertiesKeys.Libelle}
			LIMIT $2;
			`,
			);
			prepared.bindVarchar(1, `${query}%`);
		} else {
			prepared = await connection.prepare(
				`
			SELECT
			sv.${SearchViewColumns.Source} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Source]}, 
			sv.${SearchViewColumns.Id} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Id]}, 
			sv.${SearchViewColumns.Libelle} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.Libelle]}, 
			sv.${SearchViewColumns.ExtraData} as ${SEARCH_VIEW_MAPPING[SearchViewColumns.ExtraData]}
			FROM main.${SEARCH_VIEW_TABLE} sv
			WHERE sv.${SearchViewColumns.SanitizedLibelle} like $1
			ORDER BY sv.${SearchViewColumns.Libelle}
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
				SEARCH_VIEW_MAPPING[SearchViewColumns.ExtraData] in d
					? JSON.parse(d[SEARCH_VIEW_MAPPING[SearchViewColumns.ExtraData]])
					: undefined,
		})) as SearchResult[];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch search view rows.');
	}
}
