import { RegionFeaturePropertiesKeys, RegionPropertiesKeys } from '../../models/regions';

export const REGIONS_TABLE = 'regions';
export const RegionsColumns = {
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
export const REGIONS_MAPPING = {
	[RegionsColumns.Id]: RegionPropertiesKeys.Id,
	[RegionsColumns.Nom]: RegionPropertiesKeys.Nom,
	[RegionsColumns.NbElevesTotal]: RegionPropertiesKeys.NbElevesTotal,
	[RegionsColumns.NbElevesLycees]: RegionPropertiesKeys.NbElevesLycees,
	[RegionsColumns.NbEtablissementsTotal]: RegionPropertiesKeys.NbEtablissementsTotal,
	[RegionsColumns.NbEtablissementsLycees]: RegionPropertiesKeys.NbEtablissementsLycees,
	[RegionsColumns.NbEtablissementsProtegesTotal]:
		RegionPropertiesKeys.NbEtablissementsProtegesTotal,
	[RegionsColumns.NbEtablissementsProtegesLycees]:
		RegionPropertiesKeys.NbEtablissementsProtegesLycees,
	[RegionsColumns.SurfaceExploitableMaxTotal]: RegionPropertiesKeys.SurfaceExploitableMaxTotal,
	[RegionsColumns.SurfaceExploitableMaxLycees]: RegionPropertiesKeys.SurfaceExploitableMaxLycees,
	[RegionsColumns.PotentielSolaireTotal]: RegionPropertiesKeys.PotentielSolaireTotal,
	[RegionsColumns.PotentielSolaireLycees]: RegionPropertiesKeys.PotentielSolaireLycees,
	[RegionsColumns.PotentielNbFoyersTotal]: RegionPropertiesKeys.PotentielNbFoyersTotal,
	[RegionsColumns.PotentielNbFoyersLycees]: RegionPropertiesKeys.PotentielNbFoyersLycees,
	[RegionsColumns.TopEtablissementsTotal]: RegionPropertiesKeys.TopEtablissementsTotal,
	[RegionsColumns.TopEtablissementsLycees]: RegionPropertiesKeys.TopEtablissementsLycees,
	[RegionsColumns.NbEtablissementsParNiveauPotentielTotal]:
		RegionPropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[RegionsColumns.NbEtablissementsParNiveauPotentielLycees]:
		RegionPropertiesKeys.NbEtablissementsParNiveauPotentielLycees,
} as const;

export const REGIONS_GEOJSON_MAPPING = {
	[RegionsColumns.Id]: RegionFeaturePropertiesKeys.Id,
	[RegionsColumns.Nom]: RegionFeaturePropertiesKeys.Nom,
	[RegionsColumns.PotentielSolaireTotal]: RegionFeaturePropertiesKeys.PotentielSolaireTotal,
	[RegionsColumns.PotentielSolaireLycees]: RegionFeaturePropertiesKeys.PotentielSolaireLycees,
	[RegionsColumns.PotentielSolaireColleges]: RegionFeaturePropertiesKeys.PotentielSolaireColleges,
	[RegionsColumns.PotentielSolairePrimaires]:
		RegionFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
