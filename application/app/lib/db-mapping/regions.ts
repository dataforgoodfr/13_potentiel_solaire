import { Region, RegionFeatureProperties } from '../../models/regions';

export const REGIONS_TABLE = 'regions';
/**
 * DB column names for the regions table.
 */
export const REGIONS_COLUMNS = {
	Id: 'code_region',
	Nom: 'libelle_region',
	NbElevesTotal: 'nb_eleves_total',
	NbElevesLycees: 'nb_eleves_lycees',
	NbEtablissementsTotal: 'nb_etablissements_total',
	NbEtablissementsLycees: 'nb_etablissements_lycees',
	NbEtablissementsProtegesTotal: 'nb_etablissements_proteges_total',
	NbEtablissementsProtegesLycees: 'nb_etablissements_proteges_lycees',
	SurfaceExploitableMaxTotal: 'surface_exploitable_max_total',
	SurfaceExploitableMaxLycees: 'surface_exploitable_max_lycees',
	PotentielSolaireTotal: 'potentiel_solaire_total',
	PotentielSolaireLycees: 'potentiel_solaire_lycees',
	PotentielSolaireColleges: 'potentiel_solaire_colleges',
	PotentielSolairePrimaires: 'potentiel_solaire_primaires',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersLycees: 'potentiel_nb_foyers_lycees',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsLycees: 'top_etablissements_lycees',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielLycees: 'nb_etablissements_par_niveau_potentiel_lycees',
	Geometry: 'geom',
} as const;

type RegionColumnValues = (typeof REGIONS_COLUMNS)[keyof typeof REGIONS_COLUMNS];

export const REGIONS_MAPPING = {
	[REGIONS_COLUMNS.Id]: 'code_region',
	[REGIONS_COLUMNS.Nom]: 'libelle_region',
	[REGIONS_COLUMNS.NbElevesTotal]: 'nb_eleves_total',
	[REGIONS_COLUMNS.NbElevesLycees]: 'nb_eleves_lycees',
	[REGIONS_COLUMNS.NbEtablissementsTotal]: 'nb_etablissements_total',
	[REGIONS_COLUMNS.NbEtablissementsLycees]: 'nb_etablissements_lycees',
	[REGIONS_COLUMNS.NbEtablissementsProtegesTotal]: 'nb_etablissements_proteges_total',
	[REGIONS_COLUMNS.NbEtablissementsProtegesLycees]: 'nb_etablissements_proteges_lycees',
	[REGIONS_COLUMNS.SurfaceExploitableMaxTotal]: 'surface_exploitable_max_total',
	[REGIONS_COLUMNS.SurfaceExploitableMaxLycees]: 'surface_exploitable_max_lycees',
	[REGIONS_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[REGIONS_COLUMNS.PotentielSolaireLycees]: 'potentiel_solaire_lycees',
	[REGIONS_COLUMNS.PotentielNbFoyersTotal]: 'potentiel_nb_foyers_total',
	[REGIONS_COLUMNS.PotentielNbFoyersLycees]: 'potentiel_nb_foyers_lycees',
	[REGIONS_COLUMNS.TopEtablissementsTotal]: 'top_etablissements_total',
	[REGIONS_COLUMNS.TopEtablissementsLycees]: 'top_etablissements_lycees',
	[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		'nb_etablissements_par_niveau_potentiel_total',
	[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielLycees]:
		'nb_etablissements_par_niveau_potentiel_lycees',
} as const satisfies Partial<{
	[K in RegionColumnValues]: keyof Region;
}>;

/**
 * Mapping of regions columns to RegionFeatureProperties properties for GeoJSON.
 */
export const REGIONS_GEOJSON_MAPPING = {
	[REGIONS_COLUMNS.Id]: 'code_region',
	[REGIONS_COLUMNS.Nom]: 'libelle_region',
	[REGIONS_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[REGIONS_COLUMNS.PotentielSolaireLycees]: 'potentiel_solaire_lycees',
	[REGIONS_COLUMNS.PotentielSolaireColleges]: 'potentiel_solaire_colleges',
	[REGIONS_COLUMNS.PotentielSolairePrimaires]: 'potentiel_solaire_primaires',
} as const satisfies Partial<{
	[K in RegionColumnValues]: keyof RegionFeatureProperties;
}>;
