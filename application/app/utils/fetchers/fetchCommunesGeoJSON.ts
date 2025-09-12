import { CommunesGeoJSON } from '@/app/models/communes';

const API_ROUTE = '/api/communes';

export async function fetchCommunesGeoJSON(codeDepartement: string | null) {
	try {
		const params = new URLSearchParams();
		if (codeDepartement) params.append('codeDepartement', codeDepartement);
		const queryString = params.toString();
		const url = queryString ? `${API_ROUTE}?${queryString}` : API_ROUTE;

		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to load communes from API');

		const data = (await res.json()) as CommunesGeoJSON;

		return data;
	} catch (error) {
		console.error('Error while retrieving communes data:', error);
		throw new Error('Failed to load communes from API');
	}
}
