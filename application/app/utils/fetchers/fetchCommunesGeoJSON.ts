import { cache } from 'react';

import { CommunesGeoJSON } from '@/app/models/communes';

export const fetchCommunesGeoJSON = cache(async () => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/communes.geojson`);
		if (!res.ok) throw new Error('Failed to load communes from geojson file');
		const data = (await res.json()) as CommunesGeoJSON;
		return { data };
	} catch (error) {
		//TODO: create empty geojson collection as fallback value
		console.error('Error while retrieving communes data:', error);
		return { error: true };
	}
});
