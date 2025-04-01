import { RegionsGeoJSON } from '@/app/models/regions';

import getBaseURL from './getBaseURL';

const FILE_PATH = '/data/regions.geojson';

export async function fetchRegionsGeoJSON() {
	try {
		const url = new URL(FILE_PATH, getBaseURL());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load regions from API');

		const data = (await res.json()) as RegionsGeoJSON;

		return data;
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving regions data:', error);
		throw new Error('Failed to load regions from API');
	}
}
