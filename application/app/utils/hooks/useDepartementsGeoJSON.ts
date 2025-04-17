import centroid from '@turf/centroid';
import { Feature, FeatureCollection } from 'geojson';
import useSWR from 'swr';

import { fetchDepartementsGeoJSON } from '../fetchers/fetchDepartementsGeoJSON';

function getDepartementsLabelPoints(data: FeatureCollection): FeatureCollection {
	const seen = new Set<string>();
	const pointFeatures: Feature[] = [];

	for (const feature of data.features) {
		const code = feature.properties?.code_departement;
		const libelle = feature.properties?.libelle_departement;

		if (!code || seen.has(code)) continue;

		seen.add(code);

		const center = centroid(feature);

		pointFeatures.push({
			type: 'Feature',
			geometry: center.geometry,
			properties: {
				code_departement: code,
				libelle_departement: libelle,
			},
		});
	}

	return {
		type: 'FeatureCollection',
		features: pointFeatures,
	};
}

export default function useDepartementsGeoJSON(codeRegion: string | null, enabled = true) {
	const key = enabled ? ['departementsGeoJSON', codeRegion] : null;

	const { data, error, ...responseRest } = useSWR(key, () =>
		fetchDepartementsGeoJSON(codeRegion),
	);

	const departementLabelPoints = data ? getDepartementsLabelPoints(data) : null;

	return {
		departementsGeoJSON: data,
		departementLabelPoints,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
