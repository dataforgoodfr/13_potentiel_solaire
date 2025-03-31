import useSWRImmutable from 'swr/immutable';

import { fetchDepartementsGeoJSON } from '../fetchers/fetchDepartementsGeoJSON';

export default function useDepartementsGeoJSON(codeRegion: string | null, enabled = true) {
	const key = enabled ? ['departementsGeoJSON', codeRegion] : null;

	const { data, error, isLoading } = useSWRImmutable(
		key,
		() => fetchDepartementsGeoJSON(codeRegion),
		{ keepPreviousData: true },
	);

	return {
		departementsGeoJSON: data,
		isError: error,
		isLoading,
	};
}
