import { DepartementsGeoJSON } from '@/app/models/departements';

const API_ROUTE = '/api/departements';

export async function fetchDepartementsGeoJSON(codeRegion: string | null) {
	try {
		const params = new URLSearchParams();
		if (codeRegion) params.append('codeRegion', codeRegion);
		const queryString = params.toString();
		const url = queryString ? `${API_ROUTE}?${queryString}` : API_ROUTE;

		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to load departements from API');

		const data = (await res.json()) as DepartementsGeoJSON;

		return data;
	} catch (error) {
		console.error('Error while retrieving departements data:', error);
		throw new Error('Failed to load departements from API');
	}
}
