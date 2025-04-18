import { Etablissement } from '@/app/models/etablissements';

import getBaseURL from './getBaseURL';

const API_ROUTE = '/api/etablissements';

export async function fetchEtablissement(id: string) {
	try {
		const url = new URL(`${API_ROUTE}/${id}`, getBaseURL());

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to load etablissement from API');

		const data = (await res.json()) as Etablissement | null;

		return data;
	} catch (error) {
		console.error('Error while retrieving etablissement data:', error);
		throw new Error('Failed to load etablissement from API');
	}
}
