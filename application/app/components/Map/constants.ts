import { ColorSpecification } from 'maplibre-gl';

import { Level } from './interfaces';

/** Keys in kWh */
export type Thresholds = Record<number, ColorSpecification>;

export const SCALE_COLORS = {
	low: '#fffbd6',
	middle: '#faea5e',
	high: '#e19803',
} as const;

/** In kWh */
const ETABLISSEMENTS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	330000: SCALE_COLORS.middle,
	660000: SCALE_COLORS.high,
};

/** In kWh */
const COMMUNES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	30000: SCALE_COLORS.middle,
	192000: SCALE_COLORS.high,
};

/** In kWh */
const DEPARTEMENTS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	56000000: SCALE_COLORS.middle,
	120000000: SCALE_COLORS.high,
};

/** In kWh */
const REGIONS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	429000000: SCALE_COLORS.middle,
	860000000: SCALE_COLORS.high,
};

/**
 * NIVEAU -> RESSOURCES
 * Nation (aucun code) -> regions
 * Region (codeRegion existe) -> departements
 * Departement (codeDepartement existe) -> communes
 * Commune (codeCommune existe) -> etablissements
 * Etablissement (codeEtablissement existe) -> etablissements
 *
 * Explication :
 * - Legende : au niveau commune -> COLOR_THRESHOLDS.commune (on reste au meme niveau)
 * - Layer : quand on voit la layer etablissements on est en fait au niveau commune -> COLOR_THRESHOLDS.commune
 */
export const COLOR_THRESHOLDS: Record<Level, Thresholds> = {
	etablissement: ETABLISSEMENTS_COLOR_THRESHOLDS,
	commune: ETABLISSEMENTS_COLOR_THRESHOLDS,
	departement: COMMUNES_COLOR_THRESHOLDS,
	region: DEPARTEMENTS_COLOR_THRESHOLDS,
	nation: REGIONS_COLOR_THRESHOLDS,
};
