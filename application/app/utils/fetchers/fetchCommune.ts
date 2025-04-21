import { Commune } from '@/app/models/communes';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/communes';

export async function fetchCommune(id: string) {
	try {
		const url = new URL(`${API_ROUTE}/${id}`, getBaseURL());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load commune from API');

		const data = (await res.json()) as Commune | null;

		return data;
	} catch (error) {
		console.error('Error while retrieving commune data:', error);
		throw new Error('Failed to load commune from API');
	}
}
