import { LayerProps } from 'react-map-gl/maplibre';

import { zonesLayerPaint } from './zonesLayersPaint';

export const COMMUNES_SOURCE_ID = 'communes';

export const communesLayer = {
	id: 'communes',
	type: 'fill',
	source: COMMUNES_SOURCE_ID,
	paint: zonesLayerPaint,
	maxzoom: 11,
} satisfies LayerProps;

export function getDynamicalCommunesLayer(isVisible: boolean): LayerProps {
	return {
		...communesLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}

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
export function getCommunesLabelLayer(isVisible: boolean): LayerProps {
	return {
		id: 'communes-labels',
		type: 'symbol',
		source: COMMUNES_SOURCE_ID,
		layout: {
			'text-field': ['get', 'nom_commune'],
			'text-size': 10,
			'text-anchor': 'center',
			visibility: isVisible ? 'visible' : 'none',
		},
		paint: {
			'text-color': '#555555',
			'text-halo-color': '#ffffff',
			'text-halo-width': 1.5,
		},
	};
}
