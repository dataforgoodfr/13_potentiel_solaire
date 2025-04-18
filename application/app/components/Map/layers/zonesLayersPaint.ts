import { ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY } from '@/app/models/common';
import { FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export function zonesLayerPaint(thresholds: Thresholds, isBackground: boolean) {
	const fillColors = thresholdsToStepColorsParams(thresholds);

	return {
		'fill-color': ['step', ['get', ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.TOTAL], ...fillColors],
		'fill-opacity': isBackground ? 0.5 : 1,
		'fill-outline-color': 'black',
	} satisfies FillLayerSpecification['paint'];
}
