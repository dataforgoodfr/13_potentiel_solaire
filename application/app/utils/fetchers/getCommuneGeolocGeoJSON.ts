import { SimpleLngLat } from '@/app/lib/data';
import { CommuneFeature } from '@/app/models/communes';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/geolocate';

export async function fetchCommuneGeoJSONWithGeoloc({ lat, lng }: SimpleLngLat) {
	try {
		const url = new URL(API_ROUTE, getBaseURL());

		url.searchParams.append('lat', lat.toString());
		url.searchParams.append('lng', lng.toString());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load commune with geoloc from API');

		const data = (await res.json()) as CommuneFeature | null;

		return data;
	} catch (error) {
		console.error('Error while retrieving commune data:', error);
		throw new Error('Failed to load commune with geoloc from API');
	}
}
