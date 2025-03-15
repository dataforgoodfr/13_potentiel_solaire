import { useEffect, useState } from 'react';

import { fetchEtablissementsGeoJSON } from '../fetchers/fetchEtablissementsGeoJSON';

//TODO: use swr / tanstack query to handle loading/errors
export default function useEtablissementsGeoJSON() {
	const [result, setResult] = useState<
		undefined | Awaited<ReturnType<typeof fetchEtablissementsGeoJSON>>
	>();

	useEffect(() => {
		fetchEtablissementsGeoJSON().then(setResult);
	}, []);

	return result;
}
