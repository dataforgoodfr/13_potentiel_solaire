export const ETABLISSEMENTS_TABLE = 'etablissements';
export const ETABLISSEMENTS_MAPPING = {
	identifiant_de_l_etablissement: 'identifiant_de_l_etablissement',
	nom_etablissement: 'nom_etablissement',
	type_etablissement: 'type_etablissement',
	libelle_nature: 'libelle_nature',
	code_commune: 'code_commune',
	nom_commune: 'nom_commune',
	code_departement: 'code_departement',
	libelle_departement: 'libelle_departement',
	code_region: 'code_region',
	libelle_region: 'libelle_region',
	surface_exploitable_max: 'surface_exploitable_max',
	potentiel_solaire: 'potentiel_solaire',
	potentiel_nb_foyers: 'potentiel_nb_foyers',
	protection: 'protection',
	geom: 'geom',
	nb_eleves: 'nb_eleves',
	adresse_1: 'adresse_1',
	adresse_2: 'adresse_2',
	adresse_3: 'adresse_3',
	code_postal: 'code_postal',
} as const;

export const COMMUNES_TABLE = 'communes';
export const COMMUNES_MAPPING = {
	code_commune: 'code_commune',
	nom_commune: 'nom_commune',
	code_departement: 'code_departement',
	libelle_departement: 'libelle_departement',
	code_region: 'code_region',
	libelle_region: 'libelle_region',
	geom: 'geom',
	nb_eleves_total: 'nb_eleves_total',
	nb_eleves_primaires: 'nb_eleves_primaires',
	nb_etablissements_total: 'nb_etablissements_total',
	nb_etablissements_primaires: 'nb_etablissements_primaires',
	nb_etablissements_proteges_total: 'nb_etablissements_proteges_total',
	nb_etablissements_proteges_primaires: 'nb_etablissements_proteges_primaires',
	surface_exploitable_max_total: 'surface_exploitable_max_total',
	surface_exploitable_max_primaires: 'surface_exploitable_max_primaires',
	potentiel_solaire_total: 'potentiel_solaire_total',
	potentiel_solaire_primaires: 'potentiel_solaire_primaires',
	potentiel_nb_foyers_total: 'potentiel_nb_foyers_total',
	potentiel_nb_foyers_primaires: 'potentiel_nb_foyers_primaires',
	top_etablissements_total: 'top_etablissements_total',
	top_etablissements_primaires: 'top_etablissements_primaires',
} as const;

export const DEPARTEMENTS_TABLE = 'departements';
export const DEPARTEMENTS_MAPPING = {
	code_departement: 'code_departement',
	libelle_departement: 'libelle_departement',
	code_region: 'code_region',
	libelle_region: 'libelle_region',
	geom: 'geom',
	nb_eleves_total: 'nb_eleves_total',
	nb_eleves_colleges: 'nb_eleves_colleges',
	nb_etablissements_total: 'nb_etablissements_total',
	nb_etablissements_colleges: 'nb_etablissements_colleges',
	nb_etablissements_proteges_total: 'nb_etablissements_proteges_total',
	nb_etablissements_proteges_colleges: 'nb_etablissements_proteges_colleges',
	surface_exploitable_max_total: 'surface_exploitable_max_total',
	surface_exploitable_max_colleges: 'surface_exploitable_max_colleges',
	potentiel_solaire_total: 'potentiel_solaire_total',
	potentiel_solaire_colleges: 'potentiel_solaire_colleges',
	potentiel_nb_foyers_total: 'potentiel_nb_foyers_total',
	potentiel_nb_foyers_colleges: 'potentiel_nb_foyers_colleges',
	top_etablissements_total: 'top_etablissements_total',
	top_etablissements_colleges: 'top_etablissements_colleges',
} as const;

export const REGIONS_TABLE = 'regions';
export const REGIONS_MAPPING = {
	code_region: 'code_region',
	libelle_region: 'libelle_region',
	geom: 'geom',
	nb_eleves_total: 'nb_eleves_total',
	nb_eleves_lycees: 'nb_eleves_lycees',
	nb_etablissements_total: 'nb_etablissements_total',
	nb_etablissements_lycees: 'nb_etablissements_lycees',
	nb_etablissements_proteges_total: 'nb_etablissements_proteges_total',
	nb_etablissements_proteges_lycees: 'nb_etablissements_proteges_lycees',
	surface_exploitable_max_total: 'surface_exploitable_max_total',
	surface_exploitable_max_lycees: 'surface_exploitable_max_lycees',
	potentiel_solaire_total: 'potentiel_solaire_total',
	potentiel_solaire_lycees: 'potentiel_solaire_lycees',
	potentiel_nb_foyers_total: 'potentiel_nb_foyers_total',
	potentiel_nb_foyers_lycees: 'potentiel_nb_foyers_lycees',
	top_etablissements_total: 'top_etablissements_total',
	top_etablissements_lycees: 'top_etablissements_lycees',
} as const;

export const SEARCH_VIEW_TABLE = 'search_view';
export const SEARCH_VIEW_MAPPING = {
	source_table: 'source_table',
	id: 'id',
	libelle: 'libelle',
	sanitized_libelle: 'sanitized_libelle',
	extra_data: 'extra_data',
	extra_data_nom_commune: 'nom_commune',
	extra_data_code_postal: 'code_postal',
} as const;

export const REF_CODE_POSTAL_TABLE = 'ref_code_postal';
export const REF_CODE_POSTAL_MAPPING = {
	code_insee: 'code_insee',
	code_postal: 'code_postal',
} as const;
