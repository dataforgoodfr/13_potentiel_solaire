import { CommuneFeatureProperties } from '@/app/models/communes';
import { DepartementFeatureProperties } from '@/app/models/departements';
import { RegionFeatureProperties } from '@/app/models/regions';
import { ExpressionSpecification, FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

export const ZONE_GEOJSON_KEY_POTENTIEL_SOLAIRE_TOTAL: keyof DepartementFeatureProperties &
	keyof CommuneFeatureProperties &
	keyof RegionFeatureProperties = 'potentiel_solaire_total';

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
