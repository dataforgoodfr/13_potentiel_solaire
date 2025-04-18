import { NiveauPotentiel } from './common';

/**
 * List of the Etablissement type properties.
 */
//TODO: change values to camelCase after merge #190
export const EtablissementPropertiesKeys = {
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
	Geometry: 'geom',
	NbEleves: 'nb_eleves',
	Adresse1: 'adresse_1',
	Adresse2: 'adresse_2',
	Adresse3: 'adresse_3',
	CodePostal: 'code_postal',
	NiveauPotentiel: 'niveau_potentiel',
} as const;

export type Etablissement = {
	[EtablissementPropertiesKeys.Id]: string;
	[EtablissementPropertiesKeys.Nom]: string;
	[EtablissementPropertiesKeys.Type]: string;
	[EtablissementPropertiesKeys.LibelleNature]: string;
	[EtablissementPropertiesKeys.Adresse1]: string | null;
	[EtablissementPropertiesKeys.Adresse2]: string | null;
	[EtablissementPropertiesKeys.Adresse3]: string | null;
	[EtablissementPropertiesKeys.CodePostal]: string;
	[EtablissementPropertiesKeys.NbEleves]: number | null;
	[EtablissementPropertiesKeys.CodeCommune]: string;
	[EtablissementPropertiesKeys.NomCommune]: string;
	[EtablissementPropertiesKeys.CodeDepartement]: string;
	[EtablissementPropertiesKeys.LibelleDepartement]: string;
	[EtablissementPropertiesKeys.CodeRegion]: string;
	[EtablissementPropertiesKeys.LibelleRegion]: string;
	[EtablissementPropertiesKeys.SurfaceExploitableMax]: number;
	[EtablissementPropertiesKeys.PotentielSolaire]: number;
	[EtablissementPropertiesKeys.PotentielNbFoyers]: number;
	[EtablissementPropertiesKeys.Protection]: boolean;
	[EtablissementPropertiesKeys.NiveauPotentiel]: NiveauPotentiel;
};

//TODO: remove later
export type EtablissementWithLatLng = Etablissement & {
	longitude: number;
	latitude: number;
};

export interface TopEtablissement {
	id: string;
	libelle: string;
	potentiel_solaire: number;
	type_etablissement?: string;
}

// --- GeoJSON ----

/**
 * List of the Etablissement Feature type properties.
 */
export const EtablissementFeaturePropertiesKeys = {
	Id: 'identifiant_de_l_etablissement',
	Nom: 'nom_etablissement',
	CodeCommune: 'code_commune',
	CodeDepartement: 'code_departement',
	CodeRegion: 'code_region',
	PotentielSolaire: 'potentiel_solaire',
	Protection: 'protection',
	Geometry: 'geom',
} as const;

//TODO: clean unused properties
export interface EtablissementFeatureProperties {
	[EtablissementFeaturePropertiesKeys.Id]: string;
	[EtablissementFeaturePropertiesKeys.Nom]: string;
	[EtablissementFeaturePropertiesKeys.CodeCommune]: string;
	[EtablissementFeaturePropertiesKeys.CodeDepartement]: string;
	[EtablissementFeaturePropertiesKeys.CodeRegion]: string;
	[EtablissementFeaturePropertiesKeys.PotentielSolaire]: number;
	[EtablissementFeaturePropertiesKeys.Protection]: boolean;
}

export type EtablissementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Point,
	EtablissementFeatureProperties
>;

export type EtablissementFeature = EtablissementsGeoJSON['features'][number];

export interface TopEtablissement {
	id: string;
	libelle: string;
	potentiel_solaire: number;
}
