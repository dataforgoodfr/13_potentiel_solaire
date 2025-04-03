import { ColorSpecification } from 'maplibre-gl';

/** Keys in kWh */
export type Thresholds = Record<number, ColorSpecification>;

export const SCALE_COLORS = {
	low: '#fffbd6',
	middle: '#faea5e',
	high: '#e19803',
} as const;

// TODO - Update the thresholds with the correct values

/** In kWh */
const ETABLISSEMENTS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	250000: SCALE_COLORS.middle,
	750000: SCALE_COLORS.high,
};

/** In kWh */
const COMMUNES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	250000: SCALE_COLORS.middle,
	750000: SCALE_COLORS.high,
};

/** In kWh */
const DEPARTEMENTS_COLOR__THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	250000: SCALE_COLORS.middle,
	750000: SCALE_COLORS.high,
};

/** In kWh */
const REGIONS_COLOR__THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	250000: SCALE_COLORS.middle,
	750000: SCALE_COLORS.high,
};

export const COLOR_THRESHOLDS = {
	etablissements: ETABLISSEMENTS_COLOR_THRESHOLDS,
	communes: COMMUNES_COLOR_THRESHOLDS,
	departements: DEPARTEMENTS_COLOR__THRESHOLDS,
	regions: REGIONS_COLOR__THRESHOLDS,
};
