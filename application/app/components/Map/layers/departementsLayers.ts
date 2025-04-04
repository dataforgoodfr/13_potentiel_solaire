import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';

export const departementsLayer = {
	id: 'departements',
	type: 'fill',
	source: DEPARTEMENTS_SOURCE_ID,
	paint: zonesLayerPaint(COLOR_THRESHOLDS.departements),
	maxzoom: 11,
} satisfies LayerProps;

export function getDynamicalDepartementsLayer(isVisible: boolean): LayerProps {
	return {
		...departementsLayer,
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
