import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';

export const departementsLayer = (isVisible = true) =>
	({
		id: 'departements',
		type: 'fill',
		source: DEPARTEMENTS_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.departements, isVisible),
		maxzoom: 11,
	}) satisfies LayerProps;

export function getDynamicalDepartementsLayer(isVisible: boolean): LayerProps {
	return {
		...departementsLayer(isVisible),
		layout: { visibility: isVisible ? 'visible' : 'none' },
	};
}
