import { Thresholds } from '../components/Map/constants';

export function getColorForPotentiel(thresholds: Thresholds, potentiel: number): string {
	const entries = Object.entries(thresholds)
		.map(([threshold, color]) => [Number(threshold), color] as [number, string])
		.sort((a, b) => a[0] - b[0]);

	let lastColor = entries[0][1];

	for (const [threshold, color] of entries) {
		if (potentiel >= threshold) {
			lastColor = color;
		} else {
			break;
		}
	}

	return lastColor;
}
