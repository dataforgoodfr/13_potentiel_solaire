import { RegionFeaturePropertiesKeys, RegionPropertiesKeys } from '../../models/regions';

export const REGIONS_TABLE = 'regions';
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
export const REGIONS_MAPPING = {
	[REGIONS_COLUMNS.Id]: RegionPropertiesKeys.Id,
	[REGIONS_COLUMNS.Nom]: RegionPropertiesKeys.Nom,
	[REGIONS_COLUMNS.NbElevesTotal]: RegionPropertiesKeys.NbElevesTotal,
	[REGIONS_COLUMNS.NbElevesLycees]: RegionPropertiesKeys.NbElevesLycees,
	[REGIONS_COLUMNS.NbEtablissementsTotal]: RegionPropertiesKeys.NbEtablissementsTotal,
	[REGIONS_COLUMNS.NbEtablissementsLycees]: RegionPropertiesKeys.NbEtablissementsLycees,
	[REGIONS_COLUMNS.NbEtablissementsProtegesTotal]:
		RegionPropertiesKeys.NbEtablissementsProtegesTotal,
	[REGIONS_COLUMNS.NbEtablissementsProtegesLycees]:
		RegionPropertiesKeys.NbEtablissementsProtegesLycees,
	[REGIONS_COLUMNS.SurfaceExploitableMaxTotal]: RegionPropertiesKeys.SurfaceExploitableMaxTotal,
	[REGIONS_COLUMNS.SurfaceExploitableMaxLycees]: RegionPropertiesKeys.SurfaceExploitableMaxLycees,
	[REGIONS_COLUMNS.PotentielSolaireTotal]: RegionPropertiesKeys.PotentielSolaireTotal,
	[REGIONS_COLUMNS.PotentielSolaireLycees]: RegionPropertiesKeys.PotentielSolaireLycees,
	[REGIONS_COLUMNS.PotentielNbFoyersTotal]: RegionPropertiesKeys.PotentielNbFoyersTotal,
	[REGIONS_COLUMNS.PotentielNbFoyersLycees]: RegionPropertiesKeys.PotentielNbFoyersLycees,
	[REGIONS_COLUMNS.TopEtablissementsTotal]: RegionPropertiesKeys.TopEtablissementsTotal,
	[REGIONS_COLUMNS.TopEtablissementsLycees]: RegionPropertiesKeys.TopEtablissementsLycees,
	[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		RegionPropertiesKeys.NbEtablissementsParNiveauPotentielTotal,
	[REGIONS_COLUMNS.NbEtablissementsParNiveauPotentielLycees]:
		RegionPropertiesKeys.NbEtablissementsParNiveauPotentielLycees,
} as const;

export const REGIONS_GEOJSON_MAPPING = {
	[REGIONS_COLUMNS.Id]: RegionFeaturePropertiesKeys.Id,
	[REGIONS_COLUMNS.Nom]: RegionFeaturePropertiesKeys.Nom,
	[REGIONS_COLUMNS.PotentielSolaireTotal]: RegionFeaturePropertiesKeys.PotentielSolaireTotal,
	[REGIONS_COLUMNS.PotentielSolaireLycees]: RegionFeaturePropertiesKeys.PotentielSolaireLycees,
	[REGIONS_COLUMNS.PotentielSolaireColleges]:
		RegionFeaturePropertiesKeys.PotentielSolaireColleges,
	[REGIONS_COLUMNS.PotentielSolairePrimaires]:
		RegionFeaturePropertiesKeys.PotentielSolairePrimaires,
} as const;
