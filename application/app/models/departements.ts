import { NbEtablissementsByNiveauPotentiel } from './common';
import { TopEtablissement, TypeEtablissement } from './etablissements';

/**
 * List of the Departement type properties.
 */
//TODO: change values to camelCase after merge #190
export const DepartementPropertiesKeys = {
	Id: 'code_departement',
	Nom: 'libelle_departement',
	CodeRegion: 'code_region',
	LibelleRegion: 'libelle_region',
	NbElevesTotal: 'nb_eleves_total',
	NbElevesColleges: 'nb_eleves_colleges',
	NbEtablissementsTotal: 'nb_etablissements_total',
	NbEtablissementsColleges: 'nb_etablissements_colleges',
	NbEtablissementsProtegesTotal: 'nb_etablissements_proteges_total',
	NbEtablissementsProtegesColleges: 'nb_etablissements_proteges_colleges',
	SurfaceExploitableMaxTotal: 'surface_exploitable_max_total',
	SurfaceExploitableMaxColleges: 'surface_exploitable_max_colleges',
	PotentielSolaireTotal: 'potentiel_solaire_total',
	PotentielSolaireColleges: 'potentiel_solaire_colleges',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersColleges: 'potentiel_nb_foyers_colleges',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsColleges: 'top_etablissements_colleges',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielColleges: 'nb_etablissements_par_niveau_potentiel_colleges',
} as const;

export type Departement = {
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	libelle_region: string;
	nb_eleves_total: number;
	nb_eleves_colleges: number;
	nb_etablissements_total: number;
	nb_etablissements_colleges: number;
	nb_etablissements_proteges_total: number;
	nb_etablissements_proteges_colleges: number;
	surface_exploitable_max_total: number;
	surface_exploitable_max_colleges: number;
	potentiel_solaire_total: number;
	potentiel_solaire_colleges: number;
	potentiel_nb_foyers_total: number;
	potentiel_nb_foyers_colleges: number;
	top_etablissements_total: Array<TopEtablissement>;
	top_etablissements_colleges: Array<TopEtablissement>;
	nb_etablissements_par_niveau_potentiel_total: NbEtablissementsByNiveauPotentiel;
	nb_etablissements_par_niveau_potentiel_colleges: NbEtablissementsByNiveauPotentiel;
};

// ---- GeoJSON ----
export interface DepartementFeatureProperties {
	code_departement: string;
	libelle_departement: string;
	code_region: string;
	potentiel_solaire_total: number;
	potentiel_solaire_lycees: number;
	potentiel_solaire_colleges: number;
	potentiel_solaire_primaires: number;
}
export type DepartementFeature = DepartementsGeoJSON['features'][number];

export type DepartementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	DepartementFeatureProperties
>;

// Reference keys for proper access with maplibre layer properties
export const DEPARTEMENT_GEOJSON_KEY_NOM: keyof DepartementFeatureProperties =
	'libelle_departement';

export const POTENTIEL_KEY_BY_LEVEL_MAPPING: Record<
	TypeEtablissement,
	keyof DepartementFeatureProperties
> = {
	Lycée: 'potentiel_solaire_lycees',
	Collège: 'potentiel_solaire_colleges',
	Ecole: 'potentiel_solaire_primaires',
};
