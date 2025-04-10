import { ETABLISSEMENTS_MAPPING } from '../lib/db-mapping';

export interface EtablissementProperties {
	[ETABLISSEMENTS_MAPPING.identifiant_de_l_etablissement]: string;
	[ETABLISSEMENTS_MAPPING.nom_etablissement]: string;
	[ETABLISSEMENTS_MAPPING.type_etablissement]: string;
	[ETABLISSEMENTS_MAPPING.libelle_nature]: string;
	[ETABLISSEMENTS_MAPPING.adresse_1]: string | null;
	[ETABLISSEMENTS_MAPPING.adresse_2]: string | null;
	[ETABLISSEMENTS_MAPPING.adresse_3]: string | null;
	[ETABLISSEMENTS_MAPPING.code_postal]: string;
	[ETABLISSEMENTS_MAPPING.nb_eleves]: number | null;
	[ETABLISSEMENTS_MAPPING.code_commune]: string;
	[ETABLISSEMENTS_MAPPING.nom_commune]: string;
	[ETABLISSEMENTS_MAPPING.code_departement]: string;
	[ETABLISSEMENTS_MAPPING.libelle_departement]: string;
	[ETABLISSEMENTS_MAPPING.code_region]: string;
	[ETABLISSEMENTS_MAPPING.libelle_region]: string;
	[ETABLISSEMENTS_MAPPING.surface_exploitable_max]: number;
	[ETABLISSEMENTS_MAPPING.potentiel_solaire]: number;
	[ETABLISSEMENTS_MAPPING.potentiel_nb_foyers]: number;
	[ETABLISSEMENTS_MAPPING.protection]: boolean;
}

export type Etablissement = EtablissementProperties & {
	longitude: number;
	latitude: number;
};

export type EtablissementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Point,
	EtablissementProperties
>;

export type EtablissementFeature = EtablissementsGeoJSON['features'][number];

export interface TopEtablissement {
	id: string;
	libelle: string;
	potentiel_solaire: number;
	type_etablissement?: string;
}
