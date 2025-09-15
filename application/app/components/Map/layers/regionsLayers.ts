import { LayerProps } from 'react-map-gl/maplibre';

import { REGIONS_GEOJSON_KEY_ID, REGIONS_GEOJSON_KEY_NOM } from '@/app/models/regions';

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
	} satisfies LayerProps;
}

export const regionsLayer = getRegionsLayer();
export const regionsBackgroundLayer = getRegionsLayer(true);

const DEFAULT_ZONE_LINE_WIDTH = 0;
const SELECTED_ZONE_LINE_WIDTH = 6;

export function getRegionsLineLayer(selectedRegionId: string | null) {
	return {
		id: 'regions-line',
		type: 'line',
		source: REGIONS_SOURCE_ID,
		paint: {
			'line-color': 'white',
			'line-width': [
				'match',
				['get', REGIONS_GEOJSON_KEY_ID],
				selectedRegionId ?? '',
				SELECTED_ZONE_LINE_WIDTH,
				DEFAULT_ZONE_LINE_WIDTH,
			],
			// 'line-opacity': 0.5,
		},
	} satisfies LayerProps;
}

export const regionsLabelsLayer = {
	id: 'regions-labels',
	type: 'symbol',
	source: REGIONS_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', REGIONS_GEOJSON_KEY_NOM],
		'text-size': 12,
		'text-anchor': 'center',
		'text-max-width': 5,
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': '#000000',
		'text-halo-color': '#ffffff',
		'text-halo-width': 2,
	},
} satisfies LayerProps;
