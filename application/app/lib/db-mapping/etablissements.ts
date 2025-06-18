import { Etablissement, EtablissementFeatureProperties } from '@/app/models/etablissements';

export const ETABLISSEMENTS_TABLE = 'etablissements';

/**
 * DB column names for the etablissements table.
 */
export const ETABLISSEMENTS_COLUMNS = {
	Id: 'identifiant_de_l_etablissement',
	Nom: 'nom_etablissement',
	Type: 'type_etablissement',
	LibelleNature: 'libelle_nature',
	CodeCommune: 'code_commune',
	NomCommune: 'nom_commune',
	CodeDepartement: 'code_departement',
	LibelleDepartement: 'libelle_departement',
	CodeRegion: 'code_region',
	LibelleRegion: 'libelle_region',
	SurfaceExploitableMax: 'surface_exploitable_max',
	PotentielSolaire: 'potentiel_solaire',
	PotentielNbFoyers: 'potentiel_nb_foyers',
	Protection: 'protection',
	NbEleves: 'nb_eleves',
	Adresse1: 'adresse_1',
	Adresse2: 'adresse_2',
	Adresse3: 'adresse_3',
	CodePostal: 'code_postal',
	NiveauPotentiel: 'niveau_potentiel',
	Geometry: 'geom',
} as const;

type EtablissementColumnValues =
	(typeof ETABLISSEMENTS_COLUMNS)[keyof typeof ETABLISSEMENTS_COLUMNS];

/**
 * Mapping of etablissements columns to Etablissement properties.
 */
export const ETABLISSEMENTS_MAPPING = {
	[ETABLISSEMENTS_COLUMNS.Id]: 'identifiant_de_l_etablissement',
	[ETABLISSEMENTS_COLUMNS.Nom]: 'nom_etablissement',
	[ETABLISSEMENTS_COLUMNS.Type]: 'type_etablissement',
	[ETABLISSEMENTS_COLUMNS.LibelleNature]: 'libelle_nature',
	[ETABLISSEMENTS_COLUMNS.CodeCommune]: 'code_commune',
	[ETABLISSEMENTS_COLUMNS.NomCommune]: 'nom_commune',
	[ETABLISSEMENTS_COLUMNS.CodeDepartement]: 'code_departement',
	[ETABLISSEMENTS_COLUMNS.LibelleDepartement]: 'libelle_departement',
	[ETABLISSEMENTS_COLUMNS.CodeRegion]: 'code_region',
	[ETABLISSEMENTS_COLUMNS.LibelleRegion]: 'libelle_region',
	[ETABLISSEMENTS_COLUMNS.SurfaceExploitableMax]: 'surface_exploitable_max',
	[ETABLISSEMENTS_COLUMNS.PotentielSolaire]: 'potentiel_solaire',
	[ETABLISSEMENTS_COLUMNS.PotentielNbFoyers]: 'potentiel_nb_foyers',
	[ETABLISSEMENTS_COLUMNS.Protection]: 'protection',
	[ETABLISSEMENTS_COLUMNS.NbEleves]: 'nb_eleves',
	[ETABLISSEMENTS_COLUMNS.Adresse1]: 'adresse_1',
	[ETABLISSEMENTS_COLUMNS.Adresse2]: 'adresse_2',
	[ETABLISSEMENTS_COLUMNS.Adresse3]: 'adresse_3',
	[ETABLISSEMENTS_COLUMNS.CodePostal]: 'code_postal',
	[ETABLISSEMENTS_COLUMNS.NiveauPotentiel]: 'niveau_potentiel',
} as const satisfies Partial<{
	[K in EtablissementColumnValues]: keyof Etablissement;
}>;

/**
 * Mapping of etablissements columns to EtablissementFeatureProperties properties for GeoJSON.
 */
export const ETABLISSEMENTS_GEOJSON_MAPPING = {
	[ETABLISSEMENTS_COLUMNS.Id]: 'identifiant_de_l_etablissement',
	[ETABLISSEMENTS_COLUMNS.Nom]: 'nom_etablissement',
	[ETABLISSEMENTS_COLUMNS.CodeCommune]: 'code_commune',
	[ETABLISSEMENTS_COLUMNS.CodeDepartement]: 'code_departement',
	[ETABLISSEMENTS_COLUMNS.CodeRegion]: 'code_region',
	[ETABLISSEMENTS_COLUMNS.PotentielSolaire]: 'potentiel_solaire',
	[ETABLISSEMENTS_COLUMNS.Protection]: 'protection',
} as const satisfies Partial<{
	[K in EtablissementColumnValues]: keyof EtablissementFeatureProperties;
}>;
