import useSWRImmutable from 'swr/immutable';

import { fetchRegion } from '../fetchers/fetchRegion';

export default function useRegion(id: string | null) {
	const key = id ? ['region', id] : null;
	const { data, error, ...responseRest } = useSWRImmutable(key, () => fetchRegion(id!));

	return {
		region: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
