import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
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

export const unclusteredPointLayer = {
	id: 'unclustered-point',
	type: 'circle',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'protection'], false]],
	paint: {
		'circle-color': [
			'step',
			['get', EtablissementFeaturePropertiesKeys.PotentielSolaire],
			...thresholdsToStepColorsParams(COLOR_THRESHOLDS.commune),
		],
		'circle-radius': 15,
	},
} satisfies LayerProps;

export const unclusteredPointProtegeLayer = {
	id: 'unclustered-point-protege',
	type: 'circle',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'protection'], true]],
	paint: {
		'circle-color': [
			'step',
			['get', 'potentiel_solaire'],
			...thresholdsToStepColorsParams(COLOR_THRESHOLDS.commune),
		],
		'circle-radius': 15,
	},
} satisfies LayerProps;

export const unclusteredPointProtegeIconLayer = {
	id: 'unclustered-point-protege-icon',
	type: 'symbol',
	source: ETABLISSEMENTS_SOURCE_ID,
	filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'protection'], true]],
	layout: {
		'text-field': ' ⓘ ',
		'text-size': 20,
		'text-offset': [0, -0.1], // offset to center the icon as the character is slightly shifted towards bottom
	},
} satisfies LayerProps;
