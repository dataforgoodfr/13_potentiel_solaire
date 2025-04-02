import { EtablissementsGeoJSON } from '@/app/models/etablissements';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/etablissements';

export async function fetchEtablissementsGeoJSON(codeCommune: string | null) {
	try {
		const url = new URL(API_ROUTE, getBaseURL());

		if (codeCommune) url.searchParams.append('codeCommune', codeCommune);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load etablissements from geojson file');

		const data = (await res.json()) as EtablissementsGeoJSON;

		return data;
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving etablissements data:', error);
		throw new Error('Failed to load etablissements from geojson file');
	}
}
