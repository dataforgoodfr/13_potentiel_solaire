import centroid from '@turf/centroid';
import type { Feature, FeatureCollection } from 'geojson';
import useSWRImmutable from 'swr/immutable';

import { fetchRegionsGeoJSON } from '../fetchers/fetchRegionsGeoJSON';

function getRegionLabelPoints(data: FeatureCollection): FeatureCollection {
	const seen = new Set<string>();
	const pointFeatures: Feature[] = [];

	for (const feature of data.features) {
		const libelleRegion = feature.properties?.libelle_region;

		if (!libelleRegion || seen.has(libelleRegion)) continue;

		seen.add(libelleRegion);

		const center = centroid(feature);

		pointFeatures.push({
			type: 'Feature',
			geometry: center.geometry,
			properties: {
				code_region: feature.properties?.code_region,
				libelle_region: libelleRegion,
			},
		});
	}

	return {
		type: 'FeatureCollection',
		features: pointFeatures,
	};
}

export default function useRegionsGeoJSON() {
	const { data, error, isLoading } = useSWRImmutable('regionsGeoJSON', fetchRegionsGeoJSON);

	const regionLabelPoints = data ? getRegionLabelPoints(data) : null;

	return {
		regionsGeoJSON: data,
		regionLabelPoints,
		isError: error,
		isLoading,
	};
}
