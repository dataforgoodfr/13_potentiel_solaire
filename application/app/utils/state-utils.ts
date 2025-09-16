import { TabId } from '../components/fiches/Fiches';
import { Codes } from './hooks/useURLParams';

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

export const LEVEL_CODE_HIERARCHY: Array<keyof Codes> = [
	CODE_REGIONS_KEY,
	CODE_DEPARTEMENTS_KEY,
	CODE_COMMUNES_KEY,
	CODE_ETABLISSEMENTS_KEY,
] as const;

export function getLongestValidHierarchy(codes: Codes): Codes {
	const validLevels: Codes = {
		codeRegion: null,
		codeDepartement: null,
		codeCommune: null,
		codeEtablissement: null,
	};
	for (const level of LEVEL_CODE_HIERARCHY) {
		if (!codes[level]) {
			break;
		}
		validLevels[level] = codes[level];
	}
	return validLevels;
}
