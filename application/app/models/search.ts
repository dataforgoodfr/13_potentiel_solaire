export const SearchPropertiesKeys = {
	Id: 'id',
	Libelle: 'libelle',
	Source: 'source' as const,
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
	ExtraDataCodeRegion: 'code_region',
	ExtraDataCodeDepartement: 'code_departement',
	ExtraDataCodeCommune: 'code_commune',
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
		[SearchPropertiesKeys.ExtraDataCodeRegion]: string;
		[SearchPropertiesKeys.ExtraDataCodeDepartement]: string;
		[SearchPropertiesKeys.ExtraDataCodeCommune]: string;
	};
};

export type CommuneResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'communes';
	[SearchPropertiesKeys.ExtraData]: {
		[SearchPropertiesKeys.ExtraDataCodeRegion]: string;
		[SearchPropertiesKeys.ExtraDataCodeDepartement]: string;
	};
};

export type DepartementResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'departements';
	[SearchPropertiesKeys.ExtraData]: {
		[SearchPropertiesKeys.ExtraDataCodeRegion]: string;
	};
};

export type RegionResult = BaseResult & {
	[SearchPropertiesKeys.Source]: 'regions';
};

export type SearchResult = EtablissementResult | CommuneResult | DepartementResult | RegionResult;
