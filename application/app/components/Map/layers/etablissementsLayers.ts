import {
	ETABLISSEMENT_GEOJSON_KEY_ID,
	ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE,
	ETABLISSEMENT_GEOJSON_KEY_PROTECTION,
} from '@/app/models/etablissements';
import type { LayerProps } from '@vis.gl/react-maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export const ETABLISSEMENTS_SOURCE_ID = 'etablissements';

export const clusterLayer = {
	id: 'clusters',
	type: 'circle',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['has', 'point_count'],
	paint: {
		'circle-color': '#e7ffd3',
		'circle-radius': 25,
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

const POINT_RADIUS = 18;
const DEFAULT_POINT_STROKE_WIDTH = 0;
const SELECTED_POINT_STROKE_WIDTH = 10;
const SELECTED_POINT_STROKE_COLOR = '#231c3f'; //the main palette blue color
const SELECTED_POINT_STROKE_OPACITY = 0.6;

/**
 * If there is a selected etablissement we add a halo around the point.
 * If stroke width = 0 the stroke is not displayed so we only handle differences between selection or not in stroke-width property.
 * @param selectedEtablissementId
 * @returns
 */
export function getUnclusteredPointLayer(selectedEtablissementId: string | null) {
	return {
		id: 'unclustered-point',
		type: 'circle',
		source: ETABLISSEMENTS_SOURCE_ID,
		filter: [
			'all',
			['!', ['has', 'point_count']],
			['==', ['get', ETABLISSEMENT_GEOJSON_KEY_PROTECTION], false],
		],
		paint: {
			'circle-color': [
				'step',
				['get', ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE],
				...thresholdsToStepColorsParams(COLOR_THRESHOLDS.commune),
			],
			'circle-radius': POINT_RADIUS,
			// add selected halo
			'circle-stroke-width': [
				'match',
				['get', ETABLISSEMENT_GEOJSON_KEY_ID],
				selectedEtablissementId ?? '',
				SELECTED_POINT_STROKE_WIDTH,
				DEFAULT_POINT_STROKE_WIDTH,
			],
			'circle-stroke-color': SELECTED_POINT_STROKE_COLOR,
			'circle-stroke-opacity': SELECTED_POINT_STROKE_OPACITY,
		},
	} satisfies LayerProps;
}

/**
 * If there is a selected etablissement we add a halo around the point.
 * If stroke width = 0 the stroke is not displayed so we only handle differences between selection or not in stroke-width property.
 * @param selectedEtablissementId
 * @returns
 */
export function getUnclusteredPointProtegeLayer(selectedEtablissementId: string | null) {
	return {
		id: 'unclustered-point-protege',
		type: 'circle',
		source: ETABLISSEMENTS_SOURCE_ID,
		filter: [
			'all',
			['!', ['has', 'point_count']],
			['==', ['get', ETABLISSEMENT_GEOJSON_KEY_PROTECTION], true],
		],
		paint: {
			'circle-color': [
				'step',
				['get', ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE],
				...thresholdsToStepColorsParams(COLOR_THRESHOLDS.commune),
			],
			'circle-radius': POINT_RADIUS,
			// add selected halo
			'circle-stroke-width': [
				'match',
				['get', ETABLISSEMENT_GEOJSON_KEY_ID],
				selectedEtablissementId ?? '',
				SELECTED_POINT_STROKE_WIDTH,
				DEFAULT_POINT_STROKE_WIDTH,
			],
			'circle-stroke-opacity': SELECTED_POINT_STROKE_OPACITY,
			'circle-stroke-color': SELECTED_POINT_STROKE_COLOR,
		},
	} satisfies LayerProps;
}

export const unclusteredPointProtegeIconLayer = {
	id: 'unclustered-point-protege-icon',
	type: 'symbol',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: [
		'all',
		['!', ['has', 'point_count']],
		['==', ['get', ETABLISSEMENT_GEOJSON_KEY_PROTECTION], true],
	],
	layout: {
		'text-field': 'i',
		'text-size': 20,
	},
	paint: {
		'text-color': '#221c3e',
	},
} satisfies LayerProps;
