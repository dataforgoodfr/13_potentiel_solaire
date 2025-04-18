import {
	DepartementFeaturePropertiesKeys,
	DepartementPropertiesKeys,
} from '../../models/departements';

export const DEPARTEMENTS_TABLE = 'departements';
export const DepartementsColumns = {
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
	[DepartementsColumns.Id]: DepartementPropertiesKeys.Id,
	[DepartementsColumns.Nom]: DepartementPropertiesKeys.Nom,
	[DepartementsColumns.CodeRegion]: DepartementPropertiesKeys.CodeRegion,
	[DepartementsColumns.LibelleRegion]: DepartementPropertiesKeys.LibelleRegion,
	[DepartementsColumns.NbElevesTotal]: DepartementPropertiesKeys.NbElevesTotal,
	[DepartementsColumns.NbElevesColleges]: DepartementPropertiesKeys.NbElevesColleges,
	[DepartementsColumns.NbEtablissementsTotal]: DepartementPropertiesKeys.NbEtablissementsTotal,
	[DepartementsColumns.NbEtablissementsColleges]:
		DepartementPropertiesKeys.NbEtablissementsColleges,
	[DepartementsColumns.NbEtablissementsProtegesTotal]:
		DepartementPropertiesKeys.NbEtablissementsProtegesTotal,
	[DepartementsColumns.NbEtablissementsProtegesColleges]:
		DepartementPropertiesKeys.NbEtablissementsProtegesColleges,
	[DepartementsColumns.SurfaceExploitableMaxTotal]:
		DepartementPropertiesKeys.SurfaceExploitableMaxTotal,
	[DepartementsColumns.SurfaceExploitableMaxColleges]:
		DepartementPropertiesKeys.SurfaceExploitableMaxColleges,
	[DepartementsColumns.PotentielSolaireTotal]: DepartementPropertiesKeys.PotentielSolaireTotal,
	[DepartementsColumns.PotentielSolaireColleges]:
		DepartementPropertiesKeys.PotentielSolaireColleges,
	[DepartementsColumns.PotentielNbFoyersTotal]: DepartementPropertiesKeys.PotentielNbFoyersTotal,
	[DepartementsColumns.PotentielNbFoyersColleges]:
		DepartementPropertiesKeys.PotentielNbFoyersColleges,
	[DepartementsColumns.TopEtablissementsTotal]: DepartementPropertiesKeys.TopEtablissementsTotal,
	[DepartementsColumns.TopEtablissementsColleges]:
		DepartementPropertiesKeys.TopEtablissementsColleges,
	[DepartementsColumns.NbEtablissementsParNiveauPotentielTotal]:
		DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[DepartementsColumns.NbEtablissementsParNiveauPotentielColleges]:
		DepartementPropertiesKeys.NbEtablissementsParNiveauPotentielColleges,
} as const;

export const DEPARTEMENTS_GEOJSON_MAPPING = {
	[DepartementsColumns.Id]: DepartementFeaturePropertiesKeys.Id,
	[DepartementsColumns.Nom]: DepartementFeaturePropertiesKeys.Nom,
	[DepartementsColumns.CodeRegion]: DepartementFeaturePropertiesKeys.CodeRegion,
	[DepartementsColumns.PotentielSolaireTotal]:
		DepartementFeaturePropertiesKeys.PotentielSolaireTotal,
	[DepartementsColumns.PotentielSolaireLycees]:
		DepartementFeaturePropertiesKeys.PotentielSolaireLycees,
	[DepartementsColumns.PotentielSolaireColleges]:
		DepartementFeaturePropertiesKeys.PotentielSolaireColleges,
	[DepartementsColumns.PotentielSolairePrimaires]:
		DepartementFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
