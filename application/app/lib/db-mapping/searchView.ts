import { SearchPropertiesKeys } from '../../models/search';

export const SEARCH_VIEW_TABLE = 'search_view';
export const SearchViewColumns = {
	Source: 'source_table',
	Id: 'id',
	Libelle: 'libelle',
	SanitizedLibelle: 'sanitized_libelle',
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
} as const;

export const SEARCH_VIEW_MAPPING = {
	[SearchViewColumns.Source]: SearchPropertiesKeys.Source,
	[SearchViewColumns.Id]: SearchPropertiesKeys.Id,
	[SearchViewColumns.Libelle]: SearchPropertiesKeys.Libelle,
	[SearchViewColumns.ExtraData]: SearchPropertiesKeys.ExtraData,
	[SearchViewColumns.ExtraDataNomCommune]: SearchPropertiesKeys.ExtraDataNomCommune,
	[SearchViewColumns.ExtraDataCodePostal]: SearchPropertiesKeys.ExtraDataCodePostal,
} as const;
export const SEARCH_VIEW_SANITIZED_LIBELLE_COLUMN = 'sanitized_libelle';

export const REF_CODE_POSTAL_TABLE = 'ref_code_postal';
export const RefCodePostalColumns = {
	CodeInsee: 'code_insee',
	CodePostal: 'code_postal',
} as const;
