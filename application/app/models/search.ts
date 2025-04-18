import { SEARCH_VIEW_MAPPING } from '../lib/db-mapping';

export type BaseResult = {
	[SEARCH_VIEW_MAPPING.id]: string;
	[SEARCH_VIEW_MAPPING.libelle]: string;
};

export type EtablissementResult = BaseResult & {
	source: 'etablissements';
	[SEARCH_VIEW_MAPPING.extra_data]: {
		[SEARCH_VIEW_MAPPING.extra_data_nom_commune]: string;
		[SEARCH_VIEW_MAPPING.extra_data_code_postal]: string;
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
