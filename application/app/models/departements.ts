import { NbEtablissementsByNiveauPotentiel, ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY } from './common';
import { TopEtablissement } from './etablissements';

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
	[DepartementPropertiesKeys.Id]: string;
	[DepartementPropertiesKeys.Nom]: string;
	[DepartementPropertiesKeys.CodeRegion]: string;
	[DepartementPropertiesKeys.LibelleRegion]: string;
	[DepartementPropertiesKeys.NbElevesTotal]: number;
	[DepartementPropertiesKeys.NbElevesColleges]: number;
	[DepartementPropertiesKeys.NbEtablissementsTotal]: number;
	[DepartementPropertiesKeys.NbEtablissementsColleges]: number;
	[DepartementPropertiesKeys.NbEtablissementsProtegesTotal]: number;
	[DepartementPropertiesKeys.NbEtablissementsProtegesColleges]: number;
	[DepartementPropertiesKeys.SurfaceExploitableMaxTotal]: number;
	[DepartementPropertiesKeys.SurfaceExploitableMaxColleges]: number;
	[DepartementPropertiesKeys.PotentielSolaireTotal]: number;
	[DepartementPropertiesKeys.PotentielSolaireColleges]: number;
	[DepartementPropertiesKeys.PotentielNbFoyersTotal]: number;
	[DepartementPropertiesKeys.PotentielNbFoyersColleges]: number;
	[DepartementPropertiesKeys.TopEtablissementsTotal]: Array<TopEtablissement>;
	[DepartementPropertiesKeys.TopEtablissementsColleges]: Array<TopEtablissement>;
	[DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: NbEtablissementsByNiveauPotentiel;
	[DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielColleges]: NbEtablissementsByNiveauPotentiel;
};

// ---- GeoJSON ----
/**
 * List of the Departement Feature type properties.
 */
export const DepartementFeaturePropertiesKeys = {
	Id: 'code_departement',
	Nom: 'libelle_departement',
	CodeRegion: 'code_region',
	PotentielSolaireTotal: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.TOTAL,
	PotentielSolaireLycees: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.LYCEES,
	PotentielSolaireColleges: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.COLLEGES,
	PotentielSolairePrimaires: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.PRIMAIRES,
} as const;

export interface DepartementFeatureProperties {
	[DepartementFeaturePropertiesKeys.Id]: string;
	[DepartementFeaturePropertiesKeys.Nom]: string;
	[DepartementFeaturePropertiesKeys.CodeRegion]: string;
	[DepartementFeaturePropertiesKeys.PotentielSolaireTotal]: number;
	[DepartementFeaturePropertiesKeys.PotentielSolaireLycees]: number;
	[DepartementFeaturePropertiesKeys.PotentielSolaireColleges]: number;
	[DepartementFeaturePropertiesKeys.PotentielSolairePrimaires]: number;
}
export type DepartementFeature = DepartementsGeoJSON['features'][number];

export type DepartementsGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	DepartementFeatureProperties
>;
