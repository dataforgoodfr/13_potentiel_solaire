import { Departement } from '@/app/models/departements';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/departements';

export async function fetchDepartement(id: string) {
	try {
		const url = new URL(`${API_ROUTE}/${id}`, getBaseURL());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load departement from API');

		const data = (await res.json()) as Departement | undefined;

		return data;
	} catch (error) {
		console.error('Error while retrieving departement data:', error);
		throw new Error('Failed to load departement from API');
	}
}
