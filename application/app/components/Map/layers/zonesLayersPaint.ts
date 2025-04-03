import { FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export function zonesLayerPaint(thresholds: Thresholds) {
	const fillColors = thresholdsToStepColorsParams(thresholds);

	return {
		'fill-color': ['step', ['get', 'potentiel_solaire'], ...fillColors],
		'fill-opacity': 0.9,
		'fill-outline-color': 'black',
	} satisfies FillLayerSpecification['paint'];
}
