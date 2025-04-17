import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const REGIONS_SOURCE_ID = 'regions';
export const REGIONS_LABELS_SOURCE_ID = 'regions-labels';

function getRegionsLayer(isBackground = false) {
	return {
		id: 'regions',
		type: 'fill',
		source: REGIONS_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.nation, isBackground),
		maxzoom: 10,
	} satisfies LayerProps;
}

export const regionsLayer = getRegionsLayer();
export const regionsBackgroundLayer = getRegionsLayer(true);

export const regionsLabelsLayer = {
	id: 'regions-labels',
	type: 'symbol',
	source: REGIONS_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', 'libelle_region'],
		'text-size': 14,
		'text-anchor': 'center',
	},
	paint: {
		'text-color': '#000000',
		'text-halo-color': '#ffffff',
		'text-halo-width': 2,
	},
} satisfies LayerProps;
