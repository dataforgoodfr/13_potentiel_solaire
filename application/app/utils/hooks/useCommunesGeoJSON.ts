import centroid from '@turf/centroid';
import { Feature, FeatureCollection } from 'geojson';
import useSWRImmutable from 'swr/immutable';

import { fetchCommunesGeoJSON } from '../fetchers/fetchCommunesGeoJSON';

function getCommunesLabelPoints(data: FeatureCollection): FeatureCollection {
	const seen = new Set<string>();
	const pointFeatures: Feature[] = [];

	for (const feature of data.features) {
		const code = feature.properties?.code_commune;
		const nom = feature.properties?.nom_commune;

		if (!code || seen.has(code)) continue;

		seen.add(code);

		const center = centroid(feature);

		pointFeatures.push({
			type: 'Feature',
			geometry: center.geometry,
			properties: {
				code_commune: code,
				nom_commune: nom,
			},
		});
	}

	return {
		type: 'FeatureCollection',
		features: pointFeatures,
	};
}

export default function useCommunesGeoJSON(codeDepartement: string | null, enabled = true) {
	const key = codeDepartement && enabled ? ['communesGeoJSON', codeDepartement] : null;

	const { data, error, ...responseRest } = useSWRImmutable(key, () =>
		fetchCommunesGeoJSON(codeDepartement),
	);

	const communeLabelPoints = data ? getCommunesLabelPoints(data) : null;

	return {
		communesGeoJSON: data,
		communeLabelPoints,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
