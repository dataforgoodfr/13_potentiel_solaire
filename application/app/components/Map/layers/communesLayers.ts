import { LayerProps } from 'react-map-gl/maplibre';

import { COMMUNE_GEOJSON_KEY_ID, COMMUNE_GEOJSON_KEY_NOM } from '@/app/models/communes';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerFillOpacity, zonesLayerPaint } from './zonesLayersPaint';

export const COMMUNES_SOURCE_ID = 'communes';
export const COMMUNES_LABELS_SOURCE_ID = 'communes-labels';

export function getCommunesLayer(
	selectedCommuneId: string | null,
	isLastLevel: boolean,
	isBackground: boolean,
) {
	return {
		id: 'communes',
		type: 'fill',
		source: COMMUNES_SOURCE_ID,
		paint: {
			...zonesLayerPaint(COLOR_THRESHOLDS.departement),
			...zonesLayerFillOpacity(
				COMMUNE_GEOJSON_KEY_ID,
				selectedCommuneId,
				isLastLevel,
				isBackground,
			),
		},
	} satisfies LayerProps;
}

const DEFAULT_ZONE_LINE_WIDTH = 2;
const DEFAULT_ZONE_LINE_COLOR = 'grey';
const SELECTED_ZONE_LINE_WIDTH = 6;
const SELECTED_ZONE_LINE_COLOR = 'white';

export function getCommunesLineLayer(selectedCommuneId: string | null) {
	return {
		id: 'communes-line',
		type: 'line',
		source: COMMUNES_SOURCE_ID,
		paint: {
			'line-color': [
				'match',
				['get', COMMUNE_GEOJSON_KEY_ID],
				selectedCommuneId ?? '',
				SELECTED_ZONE_LINE_COLOR,
				DEFAULT_ZONE_LINE_COLOR,
			],
			'line-width': [
				'match',
				['get', COMMUNE_GEOJSON_KEY_ID],
				selectedCommuneId ?? '',
				SELECTED_ZONE_LINE_WIDTH,
				DEFAULT_ZONE_LINE_WIDTH,
			],
		},
	} satisfies LayerProps;
}

/**
 * Layer for the communes label.
 * When zooming out (after the minZoom), the labels are hidden because they are too small and decrease readability.
 */
export const communesLabelsLayer = {
	id: 'communes-labels',
	type: 'symbol',
	source: COMMUNES_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', COMMUNE_GEOJSON_KEY_NOM],
		'text-size': 14,
		'text-anchor': 'center',
	},
	paint: {
		'text-color': '#333333',
		'text-halo-color': '#ffffff',
		'text-halo-width': 1.5,
	},
	minzoom: 6.5,
} satisfies LayerProps;
