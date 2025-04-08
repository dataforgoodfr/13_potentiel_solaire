import { TopEtablissement } from './etablissements';

export interface RegionProperties {
	code_region: string;
	libelle_region: string;
	surface_exploitable_max_lycees: number;
	nb_eleves_lycees: number;
	nb_etablissements_lycees: number;
	nb_etablissements_proteges_lycees: number;
	potentiel_solaire_lycees: number;
	potentiel_nb_foyers_lycees: number;
	top_etablissements_lycees: Array<TopEtablissement> | null;
	nb_etablissements_potentiel_eleve_lycees: number;
	nb_etablissements_potentiel_bon_lycees: number;
	nb_etablissements_potentiel_bas_lycees: number;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionProperties>;
