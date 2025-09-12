import { RegionsGeoJSON } from '@/app/models/regions';

const FILE_PATH = '/data/regions.geojson';

export async function fetchRegionsGeoJSON() {
	try {
		const res = await fetch(FILE_PATH);
		if (!res.ok) throw new Error('Failed to load regions from API');

		const data = (await res.json()) as RegionsGeoJSON;

		return data;
	} catch (error) {
		console.error('Error while retrieving regions data:', error);
		throw new Error('Failed to load regions from API');
	}
}
