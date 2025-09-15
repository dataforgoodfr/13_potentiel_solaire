import { LayerProps } from 'react-map-gl/maplibre';

import { DEPARTEMENT_GEOJSON_KEY_ID, DEPARTEMENT_GEOJSON_KEY_NOM } from '@/app/models/departements';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerFillOpacity, zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';
export const DEPARTEMENTS_LABELS_SOURCE_ID = 'departements-labels';

export function getDepartementsLayer(
	selectedDepartementId: string | null,
	isLastLevel: boolean,
	isBackground: boolean,
) {
	return {
		id: 'departements',
		type: 'fill',
		source: DEPARTEMENTS_SOURCE_ID,
		paint: {
			...zonesLayerPaint(COLOR_THRESHOLDS.region),
			...zonesLayerFillOpacity(
				DEPARTEMENT_GEOJSON_KEY_ID,
				selectedDepartementId,
				isLastLevel,
				isBackground,
			),
		},
	} satisfies LayerProps;
}

const DEFAULT_ZONE_LINE_WIDTH = 0;
const SELECTED_ZONE_LINE_WIDTH = 6;

export function getDepartementsLineLayer(selectedDepartementId: string | null) {
	return {
		id: 'departements-line',
		type: 'line',
		source: DEPARTEMENTS_SOURCE_ID,
		paint: {
			'line-color': 'white',
			'line-width': [
				'match',
				['get', DEPARTEMENT_GEOJSON_KEY_ID],
				selectedDepartementId ?? '',
				SELECTED_ZONE_LINE_WIDTH,
				DEFAULT_ZONE_LINE_WIDTH,
			],
		},
	} satisfies LayerProps;
}

export const departementsLabelsLayer = {
	id: 'departements-labels',
	type: 'symbol',
	source: DEPARTEMENTS_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', DEPARTEMENT_GEOJSON_KEY_NOM],
		'text-size': 12,
		'text-anchor': 'center',
		'text-max-width': 5,
		'text-allow-overlap': true,
	},
	paint: {
		'text-color': '#333333',
		'text-halo-color': '#ffffff',
		'text-halo-width': 2,
	},
} satisfies LayerProps;
