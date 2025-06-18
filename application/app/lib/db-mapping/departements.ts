import { Departement, DepartementFeatureProperties } from '@/app/models/departements';

export const DEPARTEMENTS_TABLE = 'departements';
/**
 * DB column names for the departements table.
 */
export const DEPARTEMENTS_COLUMNS = {
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
	PotentielSolaireLycees: 'potentiel_solaire_lycees',
	PotentielSolaireColleges: 'potentiel_solaire_colleges',
	PotentielSolairePrimaires: 'potentiel_solaire_primaires',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersColleges: 'potentiel_nb_foyers_colleges',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsColleges: 'top_etablissements_colleges',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielColleges: 'nb_etablissements_par_niveau_potentiel_colleges',
	Geometry: 'geom',
} as const;

type DepartementColumnValues = (typeof DEPARTEMENTS_COLUMNS)[keyof typeof DEPARTEMENTS_COLUMNS];

/**
 * Mapping of departements columns to Departement properties.
 */
export const DEPARTEMENTS_MAPPING = {
	[DEPARTEMENTS_COLUMNS.Id]: 'code_departement',
	[DEPARTEMENTS_COLUMNS.Nom]: 'libelle_departement',
	[DEPARTEMENTS_COLUMNS.CodeRegion]: 'code_region',
	[DEPARTEMENTS_COLUMNS.LibelleRegion]: 'libelle_region',
	[DEPARTEMENTS_COLUMNS.NbElevesTotal]: 'nb_eleves_total',
	[DEPARTEMENTS_COLUMNS.NbElevesColleges]: 'nb_eleves_colleges',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsTotal]: 'nb_etablissements_total',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsColleges]: 'nb_etablissements_colleges',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesTotal]: 'nb_etablissements_proteges_total',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesColleges]: 'nb_etablissements_proteges_colleges',
	[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxTotal]: 'surface_exploitable_max_total',
	[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxColleges]: 'surface_exploitable_max_colleges',
	[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]: 'potentiel_solaire_colleges',
	[DEPARTEMENTS_COLUMNS.PotentielNbFoyersTotal]: 'potentiel_nb_foyers_total',
	[DEPARTEMENTS_COLUMNS.PotentielNbFoyersColleges]: 'potentiel_nb_foyers_colleges',
	[DEPARTEMENTS_COLUMNS.TopEtablissementsTotal]: 'top_etablissements_total',
	[DEPARTEMENTS_COLUMNS.TopEtablissementsColleges]: 'top_etablissements_colleges',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		'nb_etablissements_par_niveau_potentiel_total',
	[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielColleges]:
		'nb_etablissements_par_niveau_potentiel_colleges',
} as const satisfies Partial<{
	[K in DepartementColumnValues]: keyof Departement;
}>;

/**
 * Mapping of departements columns to DepartementFeatureProperties properties for GeoJSON.
 */
export const DEPARTEMENTS_GEOJSON_MAPPING = {
	[DEPARTEMENTS_COLUMNS.Id]: 'code_departement',
	[DEPARTEMENTS_COLUMNS.Nom]: 'libelle_departement',
	[DEPARTEMENTS_COLUMNS.CodeRegion]: 'code_region',
	[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[DEPARTEMENTS_COLUMNS.PotentielSolaireLycees]: 'potentiel_solaire_lycees',
	[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]: 'potentiel_solaire_colleges',
	[DEPARTEMENTS_COLUMNS.PotentielSolairePrimaires]: 'potentiel_solaire_primaires',
} as const satisfies Partial<{
	[K in DepartementColumnValues]: keyof DepartementFeatureProperties;
}>;
