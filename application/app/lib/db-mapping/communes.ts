import { CommuneFeaturePropertiesKeys, CommunePropertiesKeys } from '../../models/communes';

export const COMMUNES_TABLE = 'communes';
export const COMMUNES_COLUMNS = {
	Id: 'code_commune',
	Nom: 'nom_commune',
	CodeDepartement: 'code_departement',
	LibelleDepartement: 'libelle_departement',
	CodeRegion: 'code_region',
	LibelleRegion: 'libelle_region',
	NbElevesTotal: 'nb_eleves_total',
	NbElevesPrimaires: 'nb_eleves_primaires',
	NbEtablissementsTotal: 'nb_etablissements_total',
	NbEtablissementsPrimaires: 'nb_etablissements_primaires',
	NbEtablissementsProtegesTotal: 'nb_etablissements_proteges_total',
	NbEtablissementsProtegesPrimaires: 'nb_etablissements_proteges_primaires',
	SurfaceExploitableMaxTotal: 'surface_exploitable_max_total',
	SurfaceExploitableMaxPrimaires: 'surface_exploitable_max_primaires',
	PotentielSolaireTotal: 'potentiel_solaire_total',
	PotentielSolaireLycees: 'potentiel_solaire_lycees',
	PotentielSolaireColleges: 'potentiel_solaire_colleges',
	PotentielSolairePrimaires: 'potentiel_solaire_primaires',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersPrimaires: 'potentiel_nb_foyers_primaires',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsPrimaires: 'top_etablissements_primaires',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielPrimaires: 'nb_etablissements_par_niveau_potentiel_primaires',
	Geometry: 'geom',
} as const;

export const COMMUNES_MAPPING = {
	[COMMUNES_COLUMNS.Id]: CommunePropertiesKeys.Id,
	[COMMUNES_COLUMNS.Nom]: CommunePropertiesKeys.Nom,
	[COMMUNES_COLUMNS.CodeDepartement]: CommunePropertiesKeys.CodeDepartement,
	[COMMUNES_COLUMNS.LibelleDepartement]: CommunePropertiesKeys.LibelleDepartement,
	[COMMUNES_COLUMNS.CodeRegion]: CommunePropertiesKeys.CodeRegion,
	[COMMUNES_COLUMNS.LibelleRegion]: CommunePropertiesKeys.LibelleRegion,
	[COMMUNES_COLUMNS.NbElevesTotal]: CommunePropertiesKeys.NbElevesTotal,
	[COMMUNES_COLUMNS.NbElevesPrimaires]: CommunePropertiesKeys.NbElevesPrimaires,
	[COMMUNES_COLUMNS.NbEtablissementsTotal]: CommunePropertiesKeys.NbEtablissementsTotal,
	[COMMUNES_COLUMNS.NbEtablissementsPrimaires]: CommunePropertiesKeys.NbEtablissementsPrimaires,
	[COMMUNES_COLUMNS.NbEtablissementsProtegesTotal]:
		CommunePropertiesKeys.NbEtablissementsProtegesTotal,
	[COMMUNES_COLUMNS.NbEtablissementsProtegesPrimaires]:
		CommunePropertiesKeys.NbEtablissementsProtegesPrimaires,
	[COMMUNES_COLUMNS.SurfaceExploitableMaxTotal]: CommunePropertiesKeys.SurfaceExploitableMaxTotal,
	[COMMUNES_COLUMNS.SurfaceExploitableMaxPrimaires]:
		CommunePropertiesKeys.SurfaceExploitableMaxPrimaires,
	[COMMUNES_COLUMNS.PotentielSolaireTotal]: CommunePropertiesKeys.PotentielSolaireTotal,
	[COMMUNES_COLUMNS.PotentielSolairePrimaires]: CommunePropertiesKeys.PotentielSolairePrimaires,
	[COMMUNES_COLUMNS.PotentielNbFoyersTotal]: CommunePropertiesKeys.PotentielNbFoyersTotal,
	[COMMUNES_COLUMNS.PotentielNbFoyersPrimaires]: CommunePropertiesKeys.PotentielNbFoyersPrimaires,
	[COMMUNES_COLUMNS.TopEtablissementsTotal]: CommunePropertiesKeys.TopEtablissementsTotal,
	[COMMUNES_COLUMNS.TopEtablissementsPrimaires]: CommunePropertiesKeys.TopEtablissementsPrimaires,
	[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		CommunePropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielPrimaires]:
		CommunePropertiesKeys.NbEtablissementsParNiveauPotentielPrimaires,
} as const;

export const COMMUNES_GEOJSON_MAPPING = {
	[COMMUNES_COLUMNS.Id]: CommuneFeaturePropertiesKeys.Id,
	[COMMUNES_COLUMNS.Nom]: CommuneFeaturePropertiesKeys.Nom,
	[COMMUNES_COLUMNS.CodeDepartement]: CommuneFeaturePropertiesKeys.CodeDepartement,
	[COMMUNES_COLUMNS.CodeRegion]: CommuneFeaturePropertiesKeys.CodeRegion,
	[COMMUNES_COLUMNS.PotentielSolaireTotal]: CommuneFeaturePropertiesKeys.PotentielSolaireTotal,
	[COMMUNES_COLUMNS.PotentielSolaireLycees]: CommuneFeaturePropertiesKeys.PotentielSolaireLycees,
	[COMMUNES_COLUMNS.PotentielSolaireColleges]:
		CommuneFeaturePropertiesKeys.PotentielSolaireColleges,
	[COMMUNES_COLUMNS.PotentielSolairePrimaires]:
		CommuneFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
