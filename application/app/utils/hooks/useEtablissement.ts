import useSWRImmutable from 'swr/immutable';

import { fetchEtablissement } from '../fetchers/fetchEtablissement';

export default function useEtablissement(id: string | null) {
	const key = id ? ['etablissement', id] : null;
	const { data, error, ...responseRest } = useSWRImmutable(key, () => fetchEtablissement(id!));

	return {
		etablissement: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
