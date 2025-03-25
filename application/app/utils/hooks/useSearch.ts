import { SearchResult } from '@/app/models/search';
import useSWR from 'swr';

import { useDebounce } from './useDebounce';

function delay(ms: number) {
	new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetcher(query: string): Promise<SearchResult[]> {
	await delay(2000);
	if (query === '') return [];
	return [
		{ id: '1', libelle: query, source: 'communes' },
		{ id: '2', libelle: query, source: 'departements' },
		{ id: '3', libelle: query, source: 'regions' },
		{
			id: '4',
			libelle: query,
			source: 'etablissements',
			data: { code_commune: 'xxx', nom_commune: 'xxx' },
		},
	];
}

export default function useDebouncedSearch(query: string, enabled = true, delay?: number) {
	const debouncedQuery = useDebounce(query, delay);

	const key = enabled && debouncedQuery !== null ? ['search', debouncedQuery] : null;

	const { data, error, isLoading } = useSWR(key, () => fetcher(debouncedQuery), {
		keepPreviousData: true,
	});

	return {
		items: data,
		isError: error,
		isLoading,
	};
}
