import { SearchResult } from '@/app/models/search';

const API_ROUTE = 'api/search';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
	try {
		const url = new URL(API_ROUTE, baseURL);
		url.searchParams.append('query', query);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch results from search with query ' + query);

		const data = (await res.json()) as SearchResult[];

		return data;
	} catch (error) {
		console.error('Error while retrieving search data with query ' + query, error);
		throw new Error('Failed to fetch results from search with query ' + query);
	}
}
