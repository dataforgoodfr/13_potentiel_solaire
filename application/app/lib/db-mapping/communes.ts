import { CommuneFeaturePropertiesKeys, CommunePropertiesKeys } from '../../models/communes';

export const COMMUNES_TABLE = 'communes';
export const CommunesColumns = {
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
	[CommunesColumns.Id]: CommunePropertiesKeys.Id,
	[CommunesColumns.Nom]: CommunePropertiesKeys.Nom,
	[CommunesColumns.CodeDepartement]: CommunePropertiesKeys.CodeDepartement,
	[CommunesColumns.LibelleDepartement]: CommunePropertiesKeys.LibelleDepartement,
	[CommunesColumns.CodeRegion]: CommunePropertiesKeys.CodeRegion,
	[CommunesColumns.LibelleRegion]: CommunePropertiesKeys.LibelleRegion,
	[CommunesColumns.NbElevesTotal]: CommunePropertiesKeys.NbElevesTotal,
	[CommunesColumns.NbElevesPrimaires]: CommunePropertiesKeys.NbElevesPrimaires,
	[CommunesColumns.NbEtablissementsTotal]: CommunePropertiesKeys.NbEtablissementsTotal,
	[CommunesColumns.NbEtablissementsPrimaires]: CommunePropertiesKeys.NbEtablissementsPrimaires,
	[CommunesColumns.NbEtablissementsProtegesTotal]:
		CommunePropertiesKeys.NbEtablissementsProtegesTotal,
	[CommunesColumns.NbEtablissementsProtegesPrimaires]:
		CommunePropertiesKeys.NbEtablissementsProtegesPrimaires,
	[CommunesColumns.SurfaceExploitableMaxTotal]: CommunePropertiesKeys.SurfaceExploitableMaxTotal,
	[CommunesColumns.SurfaceExploitableMaxPrimaires]:
		CommunePropertiesKeys.SurfaceExploitableMaxPrimaires,
	[CommunesColumns.PotentielSolaireTotal]: CommunePropertiesKeys.PotentielSolaireTotal,
	[CommunesColumns.PotentielSolairePrimaires]: CommunePropertiesKeys.PotentielSolairePrimaires,
	[CommunesColumns.PotentielNbFoyersTotal]: CommunePropertiesKeys.PotentielNbFoyersTotal,
	[CommunesColumns.PotentielNbFoyersPrimaires]: CommunePropertiesKeys.PotentielNbFoyersPrimaires,
	[CommunesColumns.TopEtablissementsTotal]: CommunePropertiesKeys.TopEtablissementsTotal,
	[CommunesColumns.TopEtablissementsPrimaires]: CommunePropertiesKeys.TopEtablissementsPrimaires,
	[CommunesColumns.NbEtablissementsParNiveauPotentielTotal]:
		CommunePropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[CommunesColumns.NbEtablissementsParNiveauPotentielPrimaires]:
		CommunePropertiesKeys.NbEtablissementsParNiveauPotentielPrimaires,
} as const;

export const COMMUNES_GEOJSON_MAPPING = {
	[CommunesColumns.Id]: CommuneFeaturePropertiesKeys.Id,
	[CommunesColumns.Nom]: CommuneFeaturePropertiesKeys.Nom,
	[CommunesColumns.CodeDepartement]: CommuneFeaturePropertiesKeys.CodeDepartement,
	[CommunesColumns.CodeRegion]: CommuneFeaturePropertiesKeys.CodeRegion,
	[CommunesColumns.PotentielSolaireTotal]: CommuneFeaturePropertiesKeys.PotentielSolaireTotal,
	[CommunesColumns.PotentielSolaireLycees]: CommuneFeaturePropertiesKeys.PotentielSolaireLycees,
	[CommunesColumns.PotentielSolaireColleges]:
		CommuneFeaturePropertiesKeys.PotentielSolaireColleges,
	[CommunesColumns.PotentielSolairePrimaires]:
		CommuneFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
