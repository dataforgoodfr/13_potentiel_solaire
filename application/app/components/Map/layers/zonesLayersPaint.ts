import { ExpressionSpecification, FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export function zonesLayerPaint(
	thresholds: Thresholds,
	isBackground: boolean,
	stepSpecification: ExpressionSpecification,
) {
	const fillColors = thresholdsToStepColorsParams(thresholds);

	return {
		'fill-color': ['step', stepSpecification, ...fillColors],
		'fill-opacity': isBackground ? 0.5 : 1,
		'fill-outline-color': 'black',
	} satisfies FillLayerSpecification['paint'];
}
