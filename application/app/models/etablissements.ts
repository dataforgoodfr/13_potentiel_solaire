import { NiveauPotentiel } from './common';

export type Etablissement = {
	identifiant_de_l_etablissement: string;
	nom_etablissement: string;
	type_etablissement: string;
	libelle_nature: string;
	adresse_1: string | null;
	adresse_2: string | null;
	adresse_3: string | null;
	code_postal: string;
	nb_eleves: number | null;
	code_commune: string;
	nom_commune: string;
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	surface_exploitable_max: number;
	potentiel_solaire: number;
	potentiel_nb_foyers: number;
	protection: boolean;
	niveau_potentiel: NiveauPotentiel;
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
//TODO: clean unused properties
export interface EtablissementFeatureProperties {
	identifiant_de_l_etablissement: string;
	nom_etablissement: string;
	code_commune: string;
	code_departement: string;
	code_region: string;
	potentiel_solaire: number;
	protection: boolean;
}

export type EtablissementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Point,
	EtablissementFeatureProperties
>;

export type EtablissementFeature = EtablissementsGeoJSON['features'][number];

// Reference keys for proper access with maplibre layer properties
export const ETABLISSEMENT_GEOJSON_KEY_PROTECTION: keyof EtablissementFeatureProperties =
	'protection';
export const ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE: keyof EtablissementFeatureProperties =
	'potentiel_solaire';
