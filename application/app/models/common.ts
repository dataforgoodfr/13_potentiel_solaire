//TODO: fetch from db at startup instead of hardcoding
export const NIVEAUX_POTENTIELS = [
	{ code: '1_HIGH', min: 250000, max: 999999999999 },
	{ code: '2_GOOD', min: 100000, max: 249999 },
	{ code: '3_LIMITED', min: 0, max: 99999 },
] as const;

export type NiveauPotentiel = (typeof NIVEAUX_POTENTIELS)[number]['code'];

export type NbEtablissementsByNiveauPotentiel = Record<NiveauPotentiel, number>;
