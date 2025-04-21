import { COLOR_THRESHOLDS } from '../components/Map/constants';

export type CarteLevel = 'etablissement' | 'commune' | 'departement' | 'region';

export function getColorForPotentiel(level: CarteLevel, potentiel: number): string {
	const thresholds = COLOR_THRESHOLDS[level];
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
