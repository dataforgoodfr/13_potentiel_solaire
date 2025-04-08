import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const COMMUNES_SOURCE_ID = 'communes';
export const COMMUNES_LABELS_SOURCE_ID = 'communes-labels';

export const communesLayer = (isBackground = true) => {
	return {
		id: 'communes',
		type: 'fill',
		source: COMMUNES_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.communes, isBackground),
		maxzoom: 11,
	} satisfies LayerProps;
};

// Used to be able to click
export const communesTransparentLayer = {
	id: 'communesTransparent',
	type: 'fill',
	source: COMMUNES_SOURCE_ID,
	paint: { 'fill-color': 'transparent' },
} satisfies LayerProps;

export function getDynamicalCommunesTransparentLayer(isVisible: boolean): LayerProps {
	return {
		...communesTransparentLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}

export const communesLineLayer = {
	id: 'communesLine',
	type: 'line',
	source: COMMUNES_SOURCE_ID,
	paint: { 'line-color': 'grey', 'line-width': 1 },
} satisfies LayerProps;

export function getDynamicalCommunesLineLayer(isVisible: boolean): LayerProps {
	return {
		...communesLineLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
export const communesLabelsLayer = {
	id: 'communes-labels',
	type: 'symbol',
	source: COMMUNES_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', 'nom_commune'],
		'text-size': 10,
		'text-anchor': 'center',
	},
	paint: {
		'text-color': '#555555',
		'text-halo-color': '#ffffff',
		'text-halo-width': 1.5,
	},
} satisfies LayerProps;
