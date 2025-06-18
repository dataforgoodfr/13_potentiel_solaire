export type BaseResult = {
	id: string;
	libelle: string;
};

export type EtablissementResult = BaseResult & {
	source: 'etablissements';
	extra_data: {
		nom_commune: string;
		code_postal: string;
		code_region: string;
		code_departement: string;
		code_commune: string;
	};
};

export type CommuneResult = BaseResult & {
	source: 'communes';
	extra_data: {
		code_region: string;
		code_departement: string;
	};
};

export type DepartementResult = BaseResult & {
	source: 'departements';
	extra_data: {
		code_region: string;
	};
};

export type RegionResult = BaseResult & {
	source: 'regions';
	extra_data: null;
};

export type SearchResult = EtablissementResult | CommuneResult | DepartementResult | RegionResult;
