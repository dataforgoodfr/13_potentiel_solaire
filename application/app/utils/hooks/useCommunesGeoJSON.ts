import useSWRImmutable from 'swr/immutable';

import { fetchCommunesGeoJSON } from '../fetchers/fetchCommunesGeoJSON';

export default function useCommunesGeoJSON(codeDepartement: string | null, enabled = true) {
	const key = enabled ? ['communesGeoJSON', codeDepartement] : null;

	const { data, error, isLoading } = useSWRImmutable(
		key,
		() => fetchCommunesGeoJSON(codeDepartement),
		{
			keepPreviousData: true,
		},
	);

	return {
		communesGeoJSON: data,
		isError: error,
		isLoading,
	};
}
