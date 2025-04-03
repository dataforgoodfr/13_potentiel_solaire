export type BaseResult = {
	id: string;
	libelle: string;
};

export type EtablissementResult = BaseResult & {
	source: 'etablissements';
	extra_data: {
		nom_commune: string;
		code_postal: string;
	};
};

export type CommuneResult = BaseResult & {
	source: 'communes';
};

export type DepartementResult = BaseResult & {
	source: 'departements';
};

export type RegionResult = BaseResult & {
	source: 'regions';
};

export type SearchResult = EtablissementResult | CommuneResult | DepartementResult | RegionResult;
