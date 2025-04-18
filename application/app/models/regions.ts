import { NbEtablissementsByNiveauPotentiel, ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY } from './common';
import { TopEtablissement } from './etablissements';

/**
 * List of the Region type properties.
 */
//TODO: change values to camelCase after merge #190
export const RegionPropertiesKeys = {
	Id: 'code_region',
	Nom: 'libelle_region',
	SurfaceExploitableMaxTotal: 'surface_exploitable_max_total',
	SurfaceExploitableMaxLycees: 'surface_exploitable_max_lycees',
	NbElevesTotal: 'nb_eleves_total',
	NbElevesLycees: 'nb_eleves_lycees',
	NbEtablissementsTotal: 'nb_etablissements_total',
	NbEtablissementsLycees: 'nb_etablissements_lycees',
	NbEtablissementsProtegesTotal: 'nb_etablissements_proteges_total',
	NbEtablissementsProtegesLycees: 'nb_etablissements_proteges_lycees',
	PotentielSolaireTotal: 'potentiel_solaire_total',
	PotentielSolaireLycees: 'potentiel_solaire_lycees',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersLycees: 'potentiel_nb_foyers_lycees',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsLycees: 'top_etablissements_lycees',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielLycees: 'nb_etablissements_par_niveau_potentiel_lycees',
} as const;

export type Region = {
	[RegionPropertiesKeys.Id]: string;
	[RegionPropertiesKeys.Nom]: string;
	[RegionPropertiesKeys.SurfaceExploitableMaxLycees]: number;
	[RegionPropertiesKeys.NbElevesTotal]: number;
	[RegionPropertiesKeys.NbElevesLycees]: number;
	[RegionPropertiesKeys.NbEtablissementsTotal]: number;
	[RegionPropertiesKeys.NbEtablissementsLycees]: number;
	[RegionPropertiesKeys.NbEtablissementsProtegesTotal]: number;
	[RegionPropertiesKeys.NbEtablissementsProtegesLycees]: number;
	[RegionPropertiesKeys.PotentielSolaireTotal]: number;
	[RegionPropertiesKeys.PotentielSolaireLycees]: number;
	[RegionPropertiesKeys.PotentielNbFoyersTotal]: number;
	[RegionPropertiesKeys.PotentielNbFoyersLycees]: number;
	[RegionPropertiesKeys.TopEtablissementsTotal]: Array<TopEtablissement>;
	[RegionPropertiesKeys.TopEtablissementsLycees]: Array<TopEtablissement>;
	[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: NbEtablissementsByNiveauPotentiel;
	[RegionPropertiesKeys.NbEtablissementsParNiveauPotentielLycees]: NbEtablissementsByNiveauPotentiel;
};

// ---- GeoJSON ----
/**
 * List of the Region Feature type properties.
 */
export const RegionFeaturePropertiesKeys = {
	Id: 'code_region',
	Nom: 'libelle_region',
	PotentielSolaireTotal: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.TOTAL,
	PotentielSolaireLycees: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.LYCEES,
	PotentielSolaireColleges: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.COLLEGES,
	PotentielSolairePrimaires: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.PRIMAIRES,
} as const;

export interface RegionFeatureProperties {
	[RegionFeaturePropertiesKeys.Id]: string;
	[RegionFeaturePropertiesKeys.Nom]: string;
	[RegionFeaturePropertiesKeys.PotentielSolaireTotal]: number;
	[RegionFeaturePropertiesKeys.PotentielSolaireLycees]: number;
	[RegionFeaturePropertiesKeys.PotentielSolaireColleges]: number;
	[RegionFeaturePropertiesKeys.PotentielSolairePrimaires]: number;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionFeatureProperties>;
