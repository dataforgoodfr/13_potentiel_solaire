export const SearchPropertiesKeys = {
	Id: 'id',
	Libelle: 'libelle',
	Source: 'source',
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
} as const;

export type BaseResult = {
	[SearchPropertiesKeys.Id]: string;
	[SearchPropertiesKeys.Libelle]: string;
};

export type EtablissementResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'etablissements';
	[SearchPropertiesKeys.ExtraData]: {
		[SearchPropertiesKeys.ExtraDataNomCommune]: string;
		[SearchPropertiesKeys.ExtraDataCodePostal]: string;
	};
};

export type CommuneResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'communes';
};

export type DepartementResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'departements';
};

export type RegionResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'regions';
};

export type SearchResult = EtablissementResult | CommuneResult | DepartementResult | RegionResult;
