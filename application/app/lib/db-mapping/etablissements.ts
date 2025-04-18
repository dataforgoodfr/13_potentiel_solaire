import {
	EtablissementFeaturePropertiesKeys,
	EtablissementPropertiesKeys,
} from '../../models/etablissements';

export const ETABLISSEMENTS_TABLE = 'etablissements';

export const EtablissementsColumns = {
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
	[EtablissementsColumns.Id]: EtablissementPropertiesKeys.Id,
	[EtablissementsColumns.Nom]: EtablissementPropertiesKeys.Nom,
	[EtablissementsColumns.Type]: EtablissementPropertiesKeys.Type,
	[EtablissementsColumns.LibelleNature]: EtablissementPropertiesKeys.LibelleNature,
	[EtablissementsColumns.CodeCommune]: EtablissementPropertiesKeys.CodeCommune,
	[EtablissementsColumns.NomCommune]: EtablissementPropertiesKeys.NomCommune,
	[EtablissementsColumns.CodeDepartement]: EtablissementPropertiesKeys.CodeDepartement,
	[EtablissementsColumns.LibelleDepartement]: EtablissementPropertiesKeys.LibelleDepartement,
	[EtablissementsColumns.CodeRegion]: EtablissementPropertiesKeys.CodeRegion,
	[EtablissementsColumns.LibelleRegion]: EtablissementPropertiesKeys.LibelleRegion,
	[EtablissementsColumns.SurfaceExploitableMax]:
		EtablissementPropertiesKeys.SurfaceExploitableMax,
	[EtablissementsColumns.PotentielSolaire]: EtablissementPropertiesKeys.PotentielSolaire,
	[EtablissementsColumns.PotentielNbFoyers]: EtablissementPropertiesKeys.PotentielNbFoyers,
	[EtablissementsColumns.Protection]: EtablissementPropertiesKeys.Protection,
	[EtablissementsColumns.NbEleves]: EtablissementPropertiesKeys.NbEleves,
	[EtablissementsColumns.Adresse1]: EtablissementPropertiesKeys.Adresse1,
	[EtablissementsColumns.Adresse2]: EtablissementPropertiesKeys.Adresse2,
	[EtablissementsColumns.Adresse3]: EtablissementPropertiesKeys.Adresse3,
	[EtablissementsColumns.CodePostal]: EtablissementPropertiesKeys.CodePostal,
	[EtablissementsColumns.NiveauPotentiel]: EtablissementPropertiesKeys.NiveauPotentiel,
} as const;

export const ETABLISSEMENTS_GEOJSON_MAPPING = {
	[EtablissementsColumns.Id]: EtablissementFeaturePropertiesKeys.Id,
	[EtablissementsColumns.Nom]: EtablissementFeaturePropertiesKeys.Nom,
	[EtablissementsColumns.CodeCommune]: EtablissementFeaturePropertiesKeys.CodeCommune,
	[EtablissementsColumns.CodeDepartement]: EtablissementFeaturePropertiesKeys.CodeDepartement,
	[EtablissementsColumns.CodeRegion]: EtablissementFeaturePropertiesKeys.CodeRegion,
	[EtablissementsColumns.PotentielSolaire]: EtablissementFeaturePropertiesKeys.PotentielSolaire,
	[EtablissementsColumns.Protection]: EtablissementFeaturePropertiesKeys.Protection,
} as const;
