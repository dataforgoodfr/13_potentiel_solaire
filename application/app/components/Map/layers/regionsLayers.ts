import { LayerProps } from 'react-map-gl/maplibre';

import { REGIONS_GEOJSON_KEY_ID, REGIONS_GEOJSON_KEY_NOM } from '@/app/models/regions';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerFillOpacity, zonesLayerPaint } from './zonesLayersPaint';

export const REGIONS_SOURCE_ID = 'regions';
export const REGIONS_LABELS_SOURCE_ID = 'regions-labels';

export function getRegionsLayer(
	selectedRegionId: string | null,
	isLastLevel: boolean,
	isBackground: boolean,
) {
	return {
		id: 'regions',
		type: 'fill',
		source: REGIONS_SOURCE_ID,
		paint: {
			...zonesLayerPaint(COLOR_THRESHOLDS.nation),
			...zonesLayerFillOpacity(
				REGIONS_GEOJSON_KEY_ID,
				selectedRegionId,
				isLastLevel,
				isBackground,
			),
		},
	} satisfies LayerProps;
}

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
		},
	} satisfies LayerProps;
}

/**
 * Labels for the regions layer.
 * We hide the label of the selected region to avoid overlap with the departement label.
 */
export function getRegionsLabelsLayer(selectedRegionId: string | null) {
	return {
		id: 'regions-labels',
		type: 'symbol',
		source: REGIONS_LABELS_SOURCE_ID,
		layout: {
			'text-field': ['get', REGIONS_GEOJSON_KEY_NOM],
			'text-size': 15,
			'text-anchor': 'center',
			'text-max-width': 5,
		},
		paint: {
			'text-opacity': [
				'match',
				['get', REGIONS_GEOJSON_KEY_ID],
				selectedRegionId ?? '',
				0,
				1,
			],
			'text-color': '#333333',
			'text-halo-color': '#ffffff',
			'text-halo-width': 1,
		},
	} satisfies LayerProps;
}
