import { Region } from '@/app/models/regions';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/regions';

export async function fetchRegion(id: string) {
	try {
		const url = new URL(`${API_ROUTE}/${id}`, getBaseURL());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load region from API');

		const data = (await res.json()) as Region | null;

		return data;
	} catch (error) {
		console.error('Error while retrieving region data:', error);
		throw new Error('Failed to load region from API');
	}
}
