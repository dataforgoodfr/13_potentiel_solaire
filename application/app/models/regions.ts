import { NbEtablissementsByNiveauPotentiel } from './common';
import { TopEtablissement } from './etablissements';

export type Region = {
	code_region: string;
	libelle_region: string;
	surface_exploitable_max_total: number;
	surface_exploitable_max_lycees: number;
	nb_eleves_total: number;
	nb_eleves_lycees: number;
	nb_etablissements_total: number;
	nb_etablissements_lycees: number;
	nb_etablissements_proteges_total: number;
	nb_etablissements_proteges_lycees: number;
	potentiel_solaire_total: number;
	potentiel_solaire_lycees: number;
	potentiel_nb_foyers_total: number;
	potentiel_nb_foyers_lycees: number;
	top_etablissements_total: Array<TopEtablissement>;
	top_etablissements_lycees: Array<TopEtablissement>;
	nb_etablissements_par_niveau_potentiel_total: NbEtablissementsByNiveauPotentiel;
	nb_etablissements_par_niveau_potentiel_lycees: NbEtablissementsByNiveauPotentiel;
};

// ---- GeoJSON ----
export interface RegionFeatureProperties {
	code_region: string;
	libelle_region: string;
	potentiel_solaire_total: number;
	potentiel_solaire_lycees: number;
	potentiel_solaire_colleges: number;
	potentiel_solaire_primaires: number;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionFeatureProperties>;

// Reference keys for proper access with maplibre layer properties
export const REGIONS_GEOJSON_KEY_NOM: keyof RegionFeatureProperties = 'libelle_region';
