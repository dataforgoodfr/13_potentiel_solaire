import { ColorSpecification, ExpressionInputType, ExpressionSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';

export default function thresholdsToStepColorsParams(thresholds: Thresholds) {
	const thresholdsEntries = Object.entries<ColorSpecification>(thresholds);

	return thresholdsEntries.flatMap(([threshold, color]) => [+threshold, color]).slice(1) as [
		ExpressionInputType | ExpressionSpecification,
		...(number | ExpressionInputType | ExpressionSpecification)[],
	];
}
