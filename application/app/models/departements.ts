import { TopEtablissement } from './etablissements';

export interface DepartementProperties {
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	nb_eleves_colleges: number;
	nb_etablissements_colleges: number;
	nb_etablissements_proteges_colleges: number;
	surface_exploitable_max_colleges: number;
	potentiel_solaire_colleges: number;
	potentiel_nb_foyers_colleges: number;
	top_etablissements_colleges: Array<TopEtablissement> | null;
	nb_etablissements_potentiel_eleve_colleges: number;
	nb_etablissements_potentiel_bon_colleges: number;
	nb_etablissements_potentiel_bas_colleges: number;
}
export type DepartementFeature = DepartementsGeoJSON['features'][number];

export type DepartementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	DepartementProperties
>;
