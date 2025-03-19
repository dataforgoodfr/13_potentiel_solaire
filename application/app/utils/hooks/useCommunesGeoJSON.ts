import { useEffect, useState } from 'react';

import { fetchCommunesGeoJSON } from '../fetchers/fetchCommunesGeoJSON';

//TODO: use swr / tanstack query to handle loading/errors
export default function useCommunesGeoJSON() {
	const [result, setResult] = useState<
		undefined | Awaited<ReturnType<typeof fetchCommunesGeoJSON>>
	>();

	useEffect(() => {
		fetchCommunesGeoJSON().then(setResult);
	}, []);

	return result;
}
