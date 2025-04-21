import useSWRImmutable from 'swr/immutable';

import { fetchCommune } from '../fetchers/fetchCommune';

export default function useCommune(id: string | null) {
	const key = id ? ['commune', id] : null;
	const { data, error, ...responseRest } = useSWRImmutable(key, () => fetchCommune(id!));

	return {
		commune: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
