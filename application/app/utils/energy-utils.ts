export type EnergyUnit = 'kWh' | 'MWh' | 'GWh';

const FOYER_CONSO_KWH = 2300;
const PERSONNES_PAR_FOYER = 2;

export function getClosestEnergyUnit(value: number): EnergyUnit {
	if (value < 1000) return 'kWh';
	if (value < 1000000) return 'MWh';

	return 'GWh';
}

export function convertKWhTo(valueInKWh: number, newUnit: EnergyUnit) {
	if (newUnit === 'GWh') return valueInKWh / 1000000;
	if (newUnit === 'MWh') return valueInKWh / 1000;

	return valueInKWh;
}

export function getFormattedPotentielSolaire(potentiel?: number): string {
	if (potentiel === undefined) return '—';
	const mwh = convertKWhTo(potentiel, 'MWh');
	return Math.round(mwh).toLocaleString('fr-FR');
}

export function getFormattedFoyersEquivalents(potentiel?: number): string {
	if (potentiel === undefined) return '—';
	const foyers = potentiel / FOYER_CONSO_KWH / PERSONNES_PAR_FOYER;
	return Math.round(foyers).toLocaleString('fr-FR');
}
