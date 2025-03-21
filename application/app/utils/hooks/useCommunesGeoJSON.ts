import useSWRImmutable from 'swr/immutable';

import { fetchCommunesGeoJSON } from '../fetchers/fetchCommunesGeoJSON';

export default function useCommunesGeoJSON() {
	const { data, error, isLoading } = useSWRImmutable('communesGeoJSON', fetchCommunesGeoJSON);

	return {
		communesGeoJSON: data,
		isError: error,
		isLoading,
	};
}
