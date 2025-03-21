import useSWRImmutable from 'swr/immutable';

import { fetchEtablissementsGeoJSON } from '../fetchers/fetchEtablissementsGeoJSON';

export default function useEtablissementsGeoJSON() {
	const { data, error, isLoading } = useSWRImmutable(
		'etablissementsGeoJSON',
		fetchEtablissementsGeoJSON,
	);

	return {
		etablissementsGeoJSON: data,
		isError: error,
		isLoading,
	};
}
