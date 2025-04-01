import { DepartementsGeoJSON } from '@/app/models/departements';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/departements';

export async function fetchDepartementsGeoJSON(codeRegion: string | null) {
	try {
		const url = new URL(API_ROUTE, getBaseURL());

		if (codeRegion) url.searchParams.append('codeRegion', codeRegion);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load departements from API');

		const data = (await res.json()) as DepartementsGeoJSON;

		return data;
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving departements data:', error);
		throw new Error('Failed to load departements from API');
	}
}
