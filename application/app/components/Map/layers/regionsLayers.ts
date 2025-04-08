import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const REGIONS_SOURCE_ID = 'regions';

export function regionsLayer(isBackground = true) {
	return {
		id: 'regions',
		type: 'fill',
		source: REGIONS_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.regions, isBackground),
		maxzoom: 10,
	} satisfies LayerProps;
}
