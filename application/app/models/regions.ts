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
  nb_etablissements_par_niveau_potentiel_lycees: {
    eleve: number;
    bon: number;
    bas: number;
  };
  nb_etablissements_par_niveau_potentiel_total: {
    eleve: number;
    bon: number;
    bas: number;
  };
	nb_eleves_total: number;
	nb_etablissements_total: number;
	potentiel_nb_foyers_total: number;
	potentiel_solaire_total: number;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionProperties>;
