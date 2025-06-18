import { SearchResult } from '../../models/search';

export const SEARCH_VIEW_TABLE = 'search_view';
/**
 * DB column names for the search view.
 */
export const SEARCH_VIEW_COLUMNS = {
	Source: 'source_table',
	Id: 'id',
	Libelle: 'libelle',
	SanitizedLibelle: 'sanitized_libelle',
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
	ExtraDataCodeRegion: 'code_region',
	ExtraDataCodeDepartement: 'code_departement',
	ExtraDataCodeCommune: 'code_commune',
} as const;

type SearchColumnValues = (typeof SEARCH_VIEW_COLUMNS)[keyof typeof SEARCH_VIEW_COLUMNS];

/**
 * Mapping of search view columns to SearchResult properties.
 */
export const SEARCH_VIEW_MAPPING = {
	[SEARCH_VIEW_COLUMNS.Source]: 'source',
	[SEARCH_VIEW_COLUMNS.Id]: 'id',
	[SEARCH_VIEW_COLUMNS.Libelle]: 'libelle',
	[SEARCH_VIEW_COLUMNS.ExtraData]: 'extra_data',
} as const satisfies Partial<{
	[K in SearchColumnValues]: keyof SearchResult;
}>;

export const REF_CODE_POSTAL_TABLE = 'ref_code_postal';
/**
 * DB column names for the ref_code_postal table.
 */
export const REF_CODE_POSTAL_COLUMNS = {
	CodeInsee: 'code_insee',
	CodePostal: 'code_postal',
} as const;
