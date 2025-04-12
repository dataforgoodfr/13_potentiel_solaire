import useSWRImmutable from 'swr/immutable';

import { fetchEtablissementsGeoJSON } from '../fetchers/fetchEtablissementsGeoJSON';

export default function useEtablissementsGeoJSON(codeCommune: string | null, enabled = true) {
	const key = enabled ? ['etablissementsGeoJSON', codeCommune] : null;

	const { data, error, ...responseRest } = useSWRImmutable(key, () =>
		fetchEtablissementsGeoJSON(codeCommune),
	);

	return {
		etablissementsGeoJSON: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
