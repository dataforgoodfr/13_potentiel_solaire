import { LayerProps } from 'react-map-gl/maplibre';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const DEPARTEMENTS_SOURCE_ID = 'departements';

export const departementsLayer = (isBackground = true) => {
	return {
		id: 'departements',
		type: 'fill',
		source: DEPARTEMENTS_SOURCE_ID,
		paint: zonesLayerPaint(COLOR_THRESHOLDS.departements, isBackground),
		maxzoom: 11,
	} satisfies LayerProps;
};
