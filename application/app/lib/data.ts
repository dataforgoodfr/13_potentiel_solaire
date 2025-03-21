import { DuckDBPreparedStatement } from '@duckdb/node-api';

import { CommunesGeoJSON } from '../models/communes';
import { Etablissement, EtablissementsGeoJSON } from '../models/etablissements';
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

export async function fetchEtablissementsGeoJSON(): Promise<EtablissementsGeoJSON> {
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
		    'nom_etablissement',
			etablissement.nom_etablissement,
            'potentiel_solaire',
            etablissement.potentiel_solaire,
			 'code_commune',
			etablissement.code_commune,
			 'nom_commune',
			etablissement.nom_commune
          ),
          'geometry', ST_AsGeoJSON(etablissement.geom)::JSON
          )
        ), [])
      ) as geojson FROM main.etablissements etablissement;
      `,
		);

		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
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
		throw new Error('Failed to fetch example rows.');
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
		throw new Error('Failed to fetch example rows.');
	}
}

export async function fetchDepartementsGeoJSON(
	codeRegion: string | null,
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
            d.potentiel_solaire
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
		throw new Error('Failed to fetch example rows.');
	}
}

export async function fetchRegionsGeoJSON(codeRegion: string | null): Promise<CommunesGeoJSON> {
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
            'code_region',
            r.code_region,
            'libelle_region',
            r.libelle_region,
            'surface_utile',
            r.surface_utile,
            'potentiel_solaire',
            r.potentiel_solaire
          ),
          'geometry', ST_AsGeoJSON(r.geom)::JSON
          )
        ), [])
      ) as geojson FROM main.regions r
      ` + (codeRegion ? 'WHERE r.code_region = $1' : ''),
		);
		if (codeRegion) {
			prepared.bindVarchar(1, codeRegion);
		}

		const reader = await prepared.runAndReadAll();
		return JSON.parse(reader.getRowsJson()[0][0] as string);
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch example rows.');
	}
}
