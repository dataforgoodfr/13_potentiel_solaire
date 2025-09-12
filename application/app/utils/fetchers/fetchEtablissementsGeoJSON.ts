import { EtablissementsGeoJSON } from '@/app/models/etablissements';

const API_ROUTE = '/api/etablissements';

export async function fetchEtablissementsGeoJSON(codeCommune: string | null) {
	try {
		const params = new URLSearchParams();
		if (codeCommune) params.append('codeCommune', codeCommune);
		const queryString = params.toString();
		const url = queryString ? `${API_ROUTE}?${queryString}` : API_ROUTE;

		const res = await fetch(url);

		if (!res.ok) throw new Error('Failed to load etablissements from geojson file');

		const data = (await res.json()) as EtablissementsGeoJSON;

		return data;
	} catch (error) {
		console.error('Error while retrieving etablissements data:', error);
		throw new Error('Failed to load etablissements from geojson file');
	}
}
