import useSWRImmutable from 'swr/immutable';

import { fetchDepartement } from '../fetchers/fetchDepartement';

export default function useDepartement(id: string | null) {
	const key = id ? ['departement', id] : null;
	const { data, error, ...responseRest } = useSWRImmutable(key, () => fetchDepartement(id!));

	return {
		departement: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
