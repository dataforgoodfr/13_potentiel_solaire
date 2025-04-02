import { CommunesGeoJSON } from '@/app/models/communes';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/communes';

export async function fetchCommunesGeoJSON(codeDepartement: string | null) {
	try {
		const url = new URL(API_ROUTE, getBaseURL());

		if (codeDepartement) url.searchParams.append('codeDepartement', codeDepartement);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load communes from API');

		const data = (await res.json()) as CommunesGeoJSON;

		return data;
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving communes data:', error);
		throw new Error('Failed to load communes from API');
	}
}
