import useSWR from 'swr';

import { fetchSearchResults } from '../fetchers/fetchSearchResults';
import { useDebounce } from './useDebounce';

export default function useDebouncedSearch(query: string, enabled = true, delay?: number) {
	const debouncedQuery = useDebounce(query, delay);

	const key =
		enabled && debouncedQuery !== null && debouncedQuery.length > 0
			? ['search', debouncedQuery]
			: null;

	const { data, error, isLoading } = useSWR(key, () => fetchSearchResults(debouncedQuery));

	return {
		items: data,
		isError: error,
		isLoading,
	};
}
