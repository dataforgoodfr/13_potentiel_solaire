export interface EtablissementProperties {
	identifiant_de_l_etablissement: string;
	nom_etablissement: string;
	type_etablissement: string;
	libelle_nature: string;
	code_commune: string;
	nom_commune: string;
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	surface_utile: number;
	rayonnement_solaire: number;
	potentiel_solaire: number;
	protection: boolean;
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
