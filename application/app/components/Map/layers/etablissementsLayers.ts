import type { LayerProps } from '@vis.gl/react-maplibre';

export const ETABLISSEMENTS_SOURCE_ID = 'etablissements';

export const clusterLayer = {
	id: 'clusters',
	type: 'circle',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['has', 'point_count'],
	paint: {
		'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
		'circle-radius': ['step', ['get', 'point_count'], 11, 100, 22, 750, 30],
	},
} satisfies LayerProps;

export const clusterCountLayer = {
	id: 'cluster-count',
	type: 'symbol',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['has', 'point_count'],
	layout: {
		'text-field': '{point_count_abbreviated}',
		'text-size': 12,
	},
} satisfies LayerProps;

export const unclusteredPointLayer = {
	id: 'unclustered-point',
	type: 'circle',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['!', ['has', 'point_count']],
	paint: {
		'circle-color': '#11b4da',
		'circle-radius': 4,
		'circle-stroke-width': 1,
		'circle-stroke-color': '#fff',
	},
} satisfies LayerProps;

export function getDynamicalClusterLayer(isVisible: boolean): LayerProps {
	return {
		...clusterLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}

export function getDynamicalClusterCountLayer(isVisible: boolean): LayerProps {
	return {
		...clusterCountLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}

export function getDynamicalUnclusteredPointLayer(isVisible: boolean): LayerProps {
	return {
		...unclusteredPointLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
