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
	filter: ['!', ['has', 'point_count']],
	paint: {
		'circle-color': [
			'step',
			['get', EtablissementFeaturePropertiesKeys.PotentielSolaire],
			...thresholdsToStepColorsParams(COLOR_THRESHOLDS.commune),
		],
		'circle-radius': 15,
	},
} satisfies LayerProps;

//TODO: filter by etablissement type
// export function filterByTypeFromFilters(filters: FilterState) {
// 	const potentielKeys = Object.entries(filters)
// 		.filter(([key, value]) => key !== 'All' && value === true)
// 		.map(([key]) => ['get', POTENTIEL_KEY_BY_LEVEL_MAPPING[key as TypeEtablissement]]);
// 	return ['+', ...potentielKeys];
// }
