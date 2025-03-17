import { DuckDBPreparedStatement } from '@duckdb/node-api';

import { Communes } from '../models/communes';
import { Etablissement } from '../models/etablissements';
import db from './duckdb';

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
		throw new Error('Failed to fetch example rows.');
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
		throw new Error('Failed to fetch example rows.');
	}
}

export async function fetchCommunesFromBoundingBox({
	southWest,
	northEast,
}: {
	southWest: { lat: number; lng: number };
	northEast: { lat: number; lng: number };
}): Promise<Communes> {
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
		throw new Error('Failed to fetch example rows.');
	}
}

export async function fetchCommunes(codeDepartement: string | null): Promise<Communes> {
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
		throw new Error('Failed to fetch example rows.');
	}
}
