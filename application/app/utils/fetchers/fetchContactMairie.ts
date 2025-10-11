import { ContactMairie } from '@/app/models/contact-mairie';

const API_ROUTE = '/api/contact-mairie';

export async function fetchContactMairie(codeCommune: string) {
	try {
		const params = new URLSearchParams();
		params.append('codeCommune', codeCommune);
		const url = `${API_ROUTE}?${params.toString()}`;

		const res = await fetch(url);
		if (!res.ok) throw new Error('Failed to load contact mairie from API');

		const data = (await res.json()) as ContactMairie;

		return data;
	} catch (error) {
		console.error('Error while retrieving contact mairie data:', error);
		throw new Error('Failed to load contact mairie from API');
	}
}
