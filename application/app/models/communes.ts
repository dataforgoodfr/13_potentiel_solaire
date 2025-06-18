import { NbEtablissementsByNiveauPotentiel } from './common';
import { TopEtablissement } from './etablissements';

export type Commune = {
	code_commune: string;
	nom_commune: string;
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	nb_eleves_total: number;
	nb_eleves_primaires: number;
	nb_etablissements_total: number;
	nb_etablissements_primaires: number;
	nb_etablissements_proteges_total: number;
	nb_etablissements_proteges_primaires: number;
	surface_exploitable_max_total: number;
	surface_exploitable_max_primaires: number;
	potentiel_solaire_total: number;
	potentiel_solaire_primaires: number;
	potentiel_nb_foyers_total: number;
	potentiel_nb_foyers_primaires: number;
	top_etablissements_total: Array<TopEtablissement>;
	top_etablissements_primaires: Array<TopEtablissement>;
	nb_etablissements_par_niveau_potentiel_total: NbEtablissementsByNiveauPotentiel;
	nb_etablissements_par_niveau_potentiel_primaires: NbEtablissementsByNiveauPotentiel;
};

// --- GeoJSON ----
export interface CommuneFeatureProperties {
	code_commune: string;
	nom_commune: string;
	code_departement: string;
	code_region: string;
	potentiel_solaire_total: number;
	potentiel_solaire_lycees: number;
	potentiel_solaire_colleges: number;
	potentiel_solaire_primaires: number;
}
export type CommuneFeature = CommunesGeoJSON['features'][number];

export type CommunesGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CommuneFeatureProperties
>;

// Reference keys for proper access with maplibre layer properties
export const COMMUNE_GEOJSON_KEY_NOM: keyof CommuneFeatureProperties = 'nom_commune';
