import { TabId } from '../components/fiches/Fiches';
import { Codes } from './hooks/useURLParams';

/**
 * Return true if at least one code is different between the two Codes objects.
 * @param codes1
 * @param codes2
 * @returns
 */
export function codesDiffer(codes1: Codes, codes2: Codes): boolean {
	return (
		codes1.codeRegion !== codes2.codeRegion ||
		codes1.codeDepartement !== codes2.codeDepartement ||
		codes1.codeCommune !== codes2.codeCommune ||
		codes1.codeEtablissement !== codes2.codeEtablissement
	);
}

export const ACTIVE_TAB_KEY = 'activeTab';

export function buildActiveTabParam(tabId: TabId): URLSearchParams {
	return new URLSearchParams({ [ACTIVE_TAB_KEY]: tabId });
}

export const CODE_REGIONS_KEY: keyof Codes = 'codeRegion';
export const CODE_DEPARTEMENTS_KEY: keyof Codes = 'codeDepartement';
export const CODE_COMMUNES_KEY: keyof Codes = 'codeCommune';
export const CODE_ETABLISSEMENTS_KEY: keyof Codes = 'codeEtablissement';

export function buildCodesParam(codes: Record<keyof Codes, string>): URLSearchParams {
	return new URLSearchParams({ ...codes });
}

/**
 * Define the hierarchy of codes from the highest level (region) to the lowest level (etablissement).
 */
export const LEVEL_CODE_HIERARCHY: Array<keyof Codes> = [
	CODE_REGIONS_KEY,
	CODE_DEPARTEMENTS_KEY,
	CODE_COMMUNES_KEY,
	CODE_ETABLISSEMENTS_KEY,
] as const;

/**
 * Map a code key to a TabId.
 */
export const CODE_TO_TAB_ID_MAP: Record<keyof Codes, TabId> = {
	codeRegion: 'region',
	codeDepartement: 'departement',
	codeCommune: 'commune',
	codeEtablissement: 'etablissement',
};

/**
 * Return the longest valid hierarchy of codes (from region to etablissement) and the last valid level (key of Codes) or null if no level is valid.
 * @param codes
 * @returns A tuple with the longest valid hierarchy of codes and the last valid level
 */
export function getLongestValidHierarchy(codes: Codes): [Codes, keyof Codes | null] {
	const validLevels: Codes = {
		codeRegion: null,
		codeDepartement: null,
		codeCommune: null,
		codeEtablissement: null,
	};
	let lastValidLevel: keyof Codes | null = null;
	for (const level of LEVEL_CODE_HIERARCHY) {
		if (!codes[level]) {
			break;
		}
		lastValidLevel = level;
		validLevels[level] = codes[level];
	}
	return [validLevels, lastValidLevel];
}
