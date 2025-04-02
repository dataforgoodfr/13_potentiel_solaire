import { LayerProps } from 'react-map-gl/maplibre';

import { zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';

export const departementsLayer = {
	id: 'departements',
	type: 'fill',
	source: DEPARTEMENTS_SOURCE_ID,
	paint: zonesLayerPaint,
	maxzoom: 11,
} satisfies LayerProps;

export function getDynamicalDepartementsLayer(isVisible: boolean): LayerProps {
	return {
		...departementsLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
