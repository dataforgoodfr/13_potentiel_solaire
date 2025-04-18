import { DEPARTEMENTS_MAPPING } from '../lib/db-mapping';
import { NbEtablissementsByNiveauPotentiel } from './common';
import { TopEtablissement } from './etablissements';

export interface DepartementProperties {
	[DEPARTEMENTS_MAPPING.code_departement]: string;
	[DEPARTEMENTS_MAPPING.libelle_departement]: string;
	[DEPARTEMENTS_MAPPING.code_region]: string;
	[DEPARTEMENTS_MAPPING.libelle_region]: string;
	[DEPARTEMENTS_MAPPING.nb_eleves_total]: number;
	[DEPARTEMENTS_MAPPING.nb_eleves_colleges]: number;
	[DEPARTEMENTS_MAPPING.nb_etablissements_total]: number;
	[DEPARTEMENTS_MAPPING.nb_etablissements_colleges]: number;
	[DEPARTEMENTS_MAPPING.nb_etablissements_proteges_total]: number;
	[DEPARTEMENTS_MAPPING.nb_etablissements_proteges_colleges]: number;
	[DEPARTEMENTS_MAPPING.surface_exploitable_max_total]: number;
	[DEPARTEMENTS_MAPPING.surface_exploitable_max_colleges]: number;
	[DEPARTEMENTS_MAPPING.potentiel_solaire_total]: number;
	[DEPARTEMENTS_MAPPING.potentiel_solaire_colleges]: number;
	[DEPARTEMENTS_MAPPING.potentiel_nb_foyers_total]: number;
	[DEPARTEMENTS_MAPPING.potentiel_nb_foyers_colleges]: number;
	[DEPARTEMENTS_MAPPING.top_etablissements_total]: Array<TopEtablissement>;
	[DEPARTEMENTS_MAPPING.top_etablissements_colleges]: Array<TopEtablissement>;
	[DEPARTEMENTS_MAPPING.nb_etablissements_par_niveau_potentiel_total]: NbEtablissementsByNiveauPotentiel;
	[DEPARTEMENTS_MAPPING.nb_etablissements_par_niveau_potentiel_colleges]: NbEtablissementsByNiveauPotentiel;
}
export type DepartementFeature = DepartementsGeoJSON['features'][number];

export type DepartementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	DepartementProperties
>;
