export type BaseResult = {
	id: string;
	libelle: string;
};

export type EtablissementResult = BaseResult & {
	source: 'etablissements';
	data: {
		code_commune: string;
		nom_commune: string;
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
