import { LayerProps } from 'react-map-gl/maplibre';

import { DepartementFeaturePropertiesKeys } from '@/app/models/departements';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';
export const DEPARTEMENTS_LABELS_SOURCE_ID = 'departements-labels';

function getDepartementsLayer(isBackground = false) {
	return {
		id: 'departements',
		type: 'fill',
		source: DEPARTEMENTS_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.region, isBackground),
		maxzoom: 11,
	} satisfies LayerProps;
}

export const departementsLayer = getDepartementsLayer();
export const departementsBackgroundLayer = getDepartementsLayer(true);

export const departementsLabelsLayer = {
	id: 'departements-labels',
	type: 'symbol',
	source: DEPARTEMENTS_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', DepartementFeaturePropertiesKeys.Nom],
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
