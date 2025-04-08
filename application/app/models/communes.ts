import { TopEtablissement } from './etablissements';

export interface CommuneProperties {
	code_commune: string;
	nom_commune: string;
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	nb_eleves_primaires: number;
	nb_etablissements_primaires: number;
	nb_etablissements_proteges_primaires: number;
	surface_exploitable_max_primaires: number;
	potentiel_solaire_primaires: number;
	potentiel_nb_foyers_primaires: number;
	top_etablissements_primaires: Array<TopEtablissement> | null;
	nb_etablissements_potentiel_eleve_primaires: number;
	nb_etablissements_potentiel_bon_primaires: number;
	nb_etablissements_potentiel_bas_primaires: number;
}
export type CommuneFeature = CommunesGeoJSON['features'][number];

export type CommunesGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CommuneProperties
>;
