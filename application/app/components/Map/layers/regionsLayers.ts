import { LayerProps } from 'react-map-gl/maplibre';

import { zonesLayerPaint } from './zonesLayersPaint';

export const REGIONS_SOURCE_ID = 'regions';

export const regionsLayer = {
	id: 'regions',
	type: 'fill',
	source: REGIONS_SOURCE_ID,
	paint: zonesLayerPaint,
	maxzoom: 10,
} satisfies LayerProps;

export function getDynamicalRegionsLayer(isVisible: boolean): LayerProps {
	return {
		...regionsLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
export function getRegionsLabelLayer(isVisible: boolean): LayerProps {
	return {
		id: 'regions-labels',
		type: 'symbol',
		source: 'regions-labels-source',
		layout: {
			'text-field': ['get', 'libelle_region'],
			'text-size': 14,
			'text-anchor': 'center',
			visibility: isVisible ? 'visible' : 'none',
		},
		paint: {
			'text-color': '#000000',
			'text-halo-color': '#ffffff',
			'text-halo-width': 2,
		},
	};
}
