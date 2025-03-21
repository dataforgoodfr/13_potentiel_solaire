import { EtablissementsGeoJSON } from '@/app/models/etablissements';

export async function fetchEtablissementsGeoJSON() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/etablissements.geojson`);
		if (!res.ok) throw new Error('Failed to load etablissements from geojson file');

		const data = (await res.json()) as EtablissementsGeoJSON;

		return data;
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving etablissements data:', error);
		throw new Error('Failed to load etablissements from geojson file');
	}
}
