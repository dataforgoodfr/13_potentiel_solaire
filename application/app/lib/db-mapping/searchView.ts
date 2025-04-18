import { SearchPropertiesKeys } from '../../models/search';

export const SEARCH_VIEW_TABLE = 'search_view';
export const SEARCH_VIEW_COLUMNS = {
	Source: 'source_table',
	Id: 'id',
	Libelle: 'libelle',
	SanitizedLibelle: 'sanitized_libelle',
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
} as const;

export const SEARCH_VIEW_MAPPING = {
	[SEARCH_VIEW_COLUMNS.Source]: SearchPropertiesKeys.Source,
	[SEARCH_VIEW_COLUMNS.Id]: SearchPropertiesKeys.Id,
	[SEARCH_VIEW_COLUMNS.Libelle]: SearchPropertiesKeys.Libelle,
	[SEARCH_VIEW_COLUMNS.ExtraData]: SearchPropertiesKeys.ExtraData,
	[SEARCH_VIEW_COLUMNS.ExtraDataNomCommune]: SearchPropertiesKeys.ExtraDataNomCommune,
	[SEARCH_VIEW_COLUMNS.ExtraDataCodePostal]: SearchPropertiesKeys.ExtraDataCodePostal,
} as const;
export const SEARCH_VIEW_SANITIZED_LIBELLE_COLUMN = 'sanitized_libelle';

export const REF_CODE_POSTAL_TABLE = 'ref_code_postal';
export const REF_CODE_POSTAL_COLUMNS = {
	CodeInsee: 'code_insee',
	CodePostal: 'code_postal',
} as const;
