import { COMMUNES_MAPPING } from '../lib/db-mapping';
import { NbEtablissementsByNiveauPotentiel } from './common';
import { TopEtablissement } from './etablissements';

export interface CommuneProperties {
	[COMMUNES_MAPPING.code_commune]: string;
	[COMMUNES_MAPPING.nom_commune]: string;
	[COMMUNES_MAPPING.code_departement]: string;
	[COMMUNES_MAPPING.libelle_departement]: string;
	[COMMUNES_MAPPING.code_region]: string;
	[COMMUNES_MAPPING.libelle_region]: string;
	[COMMUNES_MAPPING.nb_eleves_total]: number;
	[COMMUNES_MAPPING.nb_eleves_primaires]: number;
	[COMMUNES_MAPPING.nb_etablissements_total]: number;
	[COMMUNES_MAPPING.nb_etablissements_primaires]: number;
	[COMMUNES_MAPPING.nb_etablissements_proteges_total]: number;
	[COMMUNES_MAPPING.nb_etablissements_proteges_primaires]: number;
	[COMMUNES_MAPPING.surface_exploitable_max_total]: number;
	[COMMUNES_MAPPING.surface_exploitable_max_primaires]: number;
	[COMMUNES_MAPPING.potentiel_solaire_total]: number;
	[COMMUNES_MAPPING.potentiel_solaire_primaires]: number;
	[COMMUNES_MAPPING.potentiel_nb_foyers_total]: number;
	[COMMUNES_MAPPING.potentiel_nb_foyers_primaires]: number;
	[COMMUNES_MAPPING.top_etablissements_total]: Array<TopEtablissement>;
	[COMMUNES_MAPPING.top_etablissements_primaires]: Array<TopEtablissement>;
	[COMMUNES_MAPPING.nb_etablissements_par_niveau_potentiel_total]: NbEtablissementsByNiveauPotentiel;
	[COMMUNES_MAPPING.nb_etablissements_par_niveau_potentiel_primaires]: NbEtablissementsByNiveauPotentiel;
}
export type CommuneFeature = CommunesGeoJSON['features'][number];

export type CommunesGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CommuneProperties
>;
