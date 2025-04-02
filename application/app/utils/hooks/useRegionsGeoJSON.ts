import useSWRImmutable from 'swr/immutable';

import { fetchRegionsGeoJSON } from '../fetchers/fetchRegionsGeoJSON';

export default function useRegionsGeoJSON() {
	const { data, error, isLoading } = useSWRImmutable('regionsGeoJSON', () =>
		fetchRegionsGeoJSON(),
	);

	return {
		regionsGeoJSON: data,
		isError: error,
		isLoading,
	};
}
