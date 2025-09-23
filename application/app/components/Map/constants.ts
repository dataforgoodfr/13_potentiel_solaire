import { TypeEtablissement } from '@/app/models/etablissements';
import { ColorSpecification } from 'maplibre-gl';

import { Level } from './interfaces';

/** Keys in kWh */
export type Thresholds = Record<number, ColorSpecification>;

export const SCALE_COLORS = {
	low: '#fffbd6',
	middle: '#faea5e',
	high: '#e19803',
} as const;

// ---- Seuils globaux : Tous type d'etablissements ----

/** In kWh */
const ETABLISSEMENTS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	177000: SCALE_COLORS.middle,
	361000: SCALE_COLORS.high,
};

/** In kWh */
const COMMUNES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	75000: SCALE_COLORS.middle,
	217000: SCALE_COLORS.high,
};

/** In kWh */
const DEPARTEMENTS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	81000000: SCALE_COLORS.middle,
	154000000: SCALE_COLORS.high,
};

/** In kWh */
const REGIONS_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	557000000: SCALE_COLORS.middle,
	1153000000: SCALE_COLORS.high,
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

// ---- Seuils par type d'etablissement ----

/** In kWh */
/**
 * Lycées dépend des régions
 */
const LYCEES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	139363325: SCALE_COLORS.middle,
	293551410: SCALE_COLORS.high,
};

/** In kWh */
/**
 * Collèges dépend des départements
 */
const COLLEGES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	18709211: SCALE_COLORS.middle,
	36465161: SCALE_COLORS.high,
};

/** In kWh */
/**
 * Écoles dépend des communes
 */
const ECOLES_COLOR_THRESHOLDS: Thresholds = {
	0: SCALE_COLORS.low,
	74449: SCALE_COLORS.middle,
	198542: SCALE_COLORS.high,
};

export const COLOR_THRESHOLDS_BY_TYPE_ETABLISSEMENT: Record<TypeEtablissement, Thresholds> = {
	Lycée: LYCEES_COLOR_THRESHOLDS,
	Collège: COLLEGES_COLOR_THRESHOLDS,
	Ecole: ECOLES_COLOR_THRESHOLDS,
};
