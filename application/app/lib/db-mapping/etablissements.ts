import {
	EtablissementFeaturePropertiesKeys,
	EtablissementPropertiesKeys,
} from '../../models/etablissements';

export const ETABLISSEMENTS_TABLE = 'etablissements';

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

export const ETABLISSEMENTS_MAPPING = {
	[ETABLISSEMENTS_COLUMNS.Id]: EtablissementPropertiesKeys.Id,
	[ETABLISSEMENTS_COLUMNS.Nom]: EtablissementPropertiesKeys.Nom,
	[ETABLISSEMENTS_COLUMNS.Type]: EtablissementPropertiesKeys.Type,
	[ETABLISSEMENTS_COLUMNS.LibelleNature]: EtablissementPropertiesKeys.LibelleNature,
	[ETABLISSEMENTS_COLUMNS.CodeCommune]: EtablissementPropertiesKeys.CodeCommune,
	[ETABLISSEMENTS_COLUMNS.NomCommune]: EtablissementPropertiesKeys.NomCommune,
	[ETABLISSEMENTS_COLUMNS.CodeDepartement]: EtablissementPropertiesKeys.CodeDepartement,
	[ETABLISSEMENTS_COLUMNS.LibelleDepartement]: EtablissementPropertiesKeys.LibelleDepartement,
	[ETABLISSEMENTS_COLUMNS.CodeRegion]: EtablissementPropertiesKeys.CodeRegion,
	[ETABLISSEMENTS_COLUMNS.LibelleRegion]: EtablissementPropertiesKeys.LibelleRegion,
	[ETABLISSEMENTS_COLUMNS.SurfaceExploitableMax]:
		EtablissementPropertiesKeys.SurfaceExploitableMax,
	[ETABLISSEMENTS_COLUMNS.PotentielSolaire]: EtablissementPropertiesKeys.PotentielSolaire,
	[ETABLISSEMENTS_COLUMNS.PotentielNbFoyers]: EtablissementPropertiesKeys.PotentielNbFoyers,
	[ETABLISSEMENTS_COLUMNS.Protection]: EtablissementPropertiesKeys.Protection,
	[ETABLISSEMENTS_COLUMNS.NbEleves]: EtablissementPropertiesKeys.NbEleves,
	[ETABLISSEMENTS_COLUMNS.Adresse1]: EtablissementPropertiesKeys.Adresse1,
	[ETABLISSEMENTS_COLUMNS.Adresse2]: EtablissementPropertiesKeys.Adresse2,
	[ETABLISSEMENTS_COLUMNS.Adresse3]: EtablissementPropertiesKeys.Adresse3,
	[ETABLISSEMENTS_COLUMNS.CodePostal]: EtablissementPropertiesKeys.CodePostal,
	[ETABLISSEMENTS_COLUMNS.NiveauPotentiel]: EtablissementPropertiesKeys.NiveauPotentiel,
} as const;

export const ETABLISSEMENTS_GEOJSON_MAPPING = {
	[ETABLISSEMENTS_COLUMNS.Id]: EtablissementFeaturePropertiesKeys.Id,
	[ETABLISSEMENTS_COLUMNS.Nom]: EtablissementFeaturePropertiesKeys.Nom,
	[ETABLISSEMENTS_COLUMNS.CodeCommune]: EtablissementFeaturePropertiesKeys.CodeCommune,
	[ETABLISSEMENTS_COLUMNS.CodeDepartement]: EtablissementFeaturePropertiesKeys.CodeDepartement,
	[ETABLISSEMENTS_COLUMNS.CodeRegion]: EtablissementFeaturePropertiesKeys.CodeRegion,
	[ETABLISSEMENTS_COLUMNS.PotentielSolaire]: EtablissementFeaturePropertiesKeys.PotentielSolaire,
	[ETABLISSEMENTS_COLUMNS.Protection]: EtablissementFeaturePropertiesKeys.Protection,
} as const;
