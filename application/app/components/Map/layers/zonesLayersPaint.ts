import { FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export function zonesLayerPaint(thresholds: Thresholds, isBackground: boolean) {
	const fillColors = thresholdsToStepColorsParams(thresholds);

	return {
		'fill-color': ['step', ['get', 'potentiel_solaire'], ...fillColors],
		'fill-opacity': isBackground ? 0.5 : 1,
		'fill-outline-color': 'black',
	} satisfies FillLayerSpecification['paint'];
}
