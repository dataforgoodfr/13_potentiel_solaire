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

export function getDepartementsLabelLayer(isVisible: boolean): LayerProps {
	return {
		id: 'departements-labels',
		type: 'symbol',
		source: DEPARTEMENTS_SOURCE_ID,
		layout: {
			'text-field': ['get', 'libelle_departement'],
			'text-size': 12,
			'text-anchor': 'center',
			visibility: isVisible ? 'visible' : 'none',
		},
		paint: {
			'text-color': '#333333',
			'text-halo-color': '#ffffff',
			'text-halo-width': 2,
		},
	};
}
