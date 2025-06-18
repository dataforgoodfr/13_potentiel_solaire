import { Commune, CommuneFeatureProperties } from '../../models/communes';

export const COMMUNES_TABLE = 'communes';
/**
 * DB column names for the communes table.
 */
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

type CommuneColumnValues = (typeof COMMUNES_COLUMNS)[keyof typeof COMMUNES_COLUMNS];

/**
 * Mapping of communes columns to Commune properties.
 */
export const COMMUNES_MAPPING = {
	[COMMUNES_COLUMNS.Id]: 'code_commune',
	[COMMUNES_COLUMNS.Nom]: 'nom_commune',
	[COMMUNES_COLUMNS.CodeDepartement]: 'code_departement',
	[COMMUNES_COLUMNS.LibelleDepartement]: 'libelle_departement',
	[COMMUNES_COLUMNS.CodeRegion]: 'code_region',
	[COMMUNES_COLUMNS.LibelleRegion]: 'libelle_region',
	[COMMUNES_COLUMNS.NbElevesTotal]: 'nb_eleves_total',
	[COMMUNES_COLUMNS.NbElevesPrimaires]: 'nb_eleves_primaires',
	[COMMUNES_COLUMNS.NbEtablissementsTotal]: 'nb_etablissements_total',
	[COMMUNES_COLUMNS.NbEtablissementsPrimaires]: 'nb_etablissements_primaires',
	[COMMUNES_COLUMNS.NbEtablissementsProtegesTotal]: 'nb_etablissements_proteges_total',
	[COMMUNES_COLUMNS.NbEtablissementsProtegesPrimaires]: 'nb_etablissements_proteges_primaires',
	[COMMUNES_COLUMNS.SurfaceExploitableMaxTotal]: 'surface_exploitable_max_total',
	[COMMUNES_COLUMNS.SurfaceExploitableMaxPrimaires]: 'surface_exploitable_max_primaires',
	[COMMUNES_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[COMMUNES_COLUMNS.PotentielSolairePrimaires]: 'potentiel_solaire_primaires',
	[COMMUNES_COLUMNS.PotentielNbFoyersTotal]: 'potentiel_nb_foyers_total',
	[COMMUNES_COLUMNS.PotentielNbFoyersPrimaires]: 'potentiel_nb_foyers_primaires',
	[COMMUNES_COLUMNS.TopEtablissementsTotal]: 'top_etablissements_total',
	[COMMUNES_COLUMNS.TopEtablissementsPrimaires]: 'top_etablissements_primaires',
	[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielTotal]:
		'nb_etablissements_par_niveau_potentiel_total',
	[COMMUNES_COLUMNS.NbEtablissementsParNiveauPotentielPrimaires]:
		'nb_etablissements_par_niveau_potentiel_primaires',
} as const satisfies Partial<{
	[K in CommuneColumnValues]: keyof Commune;
}>;

/**
 * Mapping of communes columns to CommuneFeatureProperties properties for GeoJSON.
 */
export const COMMUNES_GEOJSON_MAPPING = {
	[COMMUNES_COLUMNS.Id]: 'code_commune',
	[COMMUNES_COLUMNS.Nom]: 'nom_commune',
	[COMMUNES_COLUMNS.CodeDepartement]: 'code_departement',
	[COMMUNES_COLUMNS.CodeRegion]: 'code_region',
	[COMMUNES_COLUMNS.PotentielSolaireTotal]: 'potentiel_solaire_total',
	[COMMUNES_COLUMNS.PotentielSolaireLycees]: 'potentiel_solaire_lycees',
	[COMMUNES_COLUMNS.PotentielSolaireColleges]: 'potentiel_solaire_colleges',
	[COMMUNES_COLUMNS.PotentielSolairePrimaires]: 'potentiel_solaire_primaires',
} as const satisfies Partial<{
	[K in CommuneColumnValues]: keyof CommuneFeatureProperties;
}>;
