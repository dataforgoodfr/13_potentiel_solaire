import {
	DepartementFeaturePropertiesKeys,
	DepartementPropertiesKeys,
} from '../../models/departements';

export const DEPARTEMENTS_TABLE = 'departements';
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

export const DEPARTEMENTS_MAPPING = {
	[DEPARTEMENTS_COLUMNS.Id]: DepartementPropertiesKeys.Id,
	[DEPARTEMENTS_COLUMNS.Nom]: DepartementPropertiesKeys.Nom,
	[DEPARTEMENTS_COLUMNS.CodeRegion]: DepartementPropertiesKeys.CodeRegion,
	[DEPARTEMENTS_COLUMNS.LibelleRegion]: DepartementPropertiesKeys.LibelleRegion,
	[DEPARTEMENTS_COLUMNS.NbElevesTotal]: DepartementPropertiesKeys.NbElevesTotal,
	[DEPARTEMENTS_COLUMNS.NbElevesColleges]: DepartementPropertiesKeys.NbElevesColleges,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsTotal]: DepartementPropertiesKeys.NbEtablissementsTotal,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsColleges]:
		DepartementPropertiesKeys.NbEtablissementsColleges,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesTotal]:
		DepartementPropertiesKeys.NbEtablissementsProtegesTotal,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsProtegesColleges]:
		DepartementPropertiesKeys.NbEtablissementsProtegesColleges,
	[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxTotal]:
		DepartementPropertiesKeys.SurfaceExploitableMaxTotal,
	[DEPARTEMENTS_COLUMNS.SurfaceExploitableMaxColleges]:
		DepartementPropertiesKeys.SurfaceExploitableMaxColleges,
	[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]: DepartementPropertiesKeys.PotentielSolaireTotal,
	[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]:
		DepartementPropertiesKeys.PotentielSolaireColleges,
	[DEPARTEMENTS_COLUMNS.PotentielNbFoyersTotal]: DepartementPropertiesKeys.PotentielNbFoyersTotal,
	[DEPARTEMENTS_COLUMNS.PotentielNbFoyersColleges]:
		DepartementPropertiesKeys.PotentielNbFoyersColleges,
	[DEPARTEMENTS_COLUMNS.TopEtablissementsTotal]: DepartementPropertiesKeys.TopEtablissementsTotal,
	[DEPARTEMENTS_COLUMNS.TopEtablissementsColleges]:
		DepartementPropertiesKeys.TopEtablissementsColleges,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[DEPARTEMENTS_COLUMNS.NbEtablissementsParNiveauPotentielColleges]:
		DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielColleges,
} as const;

export const DEPARTEMENTS_GEOJSON_MAPPING = {
	[DEPARTEMENTS_COLUMNS.Id]: DepartementFeaturePropertiesKeys.Id,
	[DEPARTEMENTS_COLUMNS.Nom]: DepartementFeaturePropertiesKeys.Nom,
	[DEPARTEMENTS_COLUMNS.CodeRegion]: DepartementFeaturePropertiesKeys.CodeRegion,
	[DEPARTEMENTS_COLUMNS.PotentielSolaireTotal]:
		DepartementFeaturePropertiesKeys.PotentielSolaireTotal,
	[DEPARTEMENTS_COLUMNS.PotentielSolaireLycees]:
		DepartementFeaturePropertiesKeys.PotentielSolaireLycees,
	[DEPARTEMENTS_COLUMNS.PotentielSolaireColleges]:
		DepartementFeaturePropertiesKeys.PotentielSolaireColleges,
	[DEPARTEMENTS_COLUMNS.PotentielSolairePrimaires]:
		DepartementFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
