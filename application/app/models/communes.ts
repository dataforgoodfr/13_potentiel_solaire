import { NbEtablissementsByNiveauPotentiel, ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY } from './common';
import { TopEtablissement } from './etablissements';

/**
 * List of the Commune type properties.
 */
//TODO: change values to camelCase after merge #190
export const CommunePropertiesKeys = {
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
	PotentielSolairePrimaires: 'potentiel_solaire_primaires',
	PotentielNbFoyersTotal: 'potentiel_nb_foyers_total',
	PotentielNbFoyersPrimaires: 'potentiel_nb_foyers_primaires',
	TopEtablissementsTotal: 'top_etablissements_total',
	TopEtablissementsPrimaires: 'top_etablissements_primaires',
	NbEtablissementsParNiveauPotentielTotal: 'nb_etablissements_par_niveau_potentiel_total',
	NbEtablissementsParNiveauPotentielPrimaires: 'nb_etablissements_par_niveau_potentiel_primaires',
} as const;

export type Commune = {
	[CommunePropertiesKeys.Id]: string;
	[CommunePropertiesKeys.Nom]: string;
	[CommunePropertiesKeys.CodeDepartement]: string;
	[CommunePropertiesKeys.LibelleDepartement]: string;
	[CommunePropertiesKeys.CodeRegion]: string;
	[CommunePropertiesKeys.LibelleRegion]: string;
	[CommunePropertiesKeys.NbElevesTotal]: number;
	[CommunePropertiesKeys.NbElevesPrimaires]: number;
	[CommunePropertiesKeys.NbEtablissementsTotal]: number;
	[CommunePropertiesKeys.NbEtablissementsPrimaires]: number;
	[CommunePropertiesKeys.NbEtablissementsProtegesTotal]: number;
	[CommunePropertiesKeys.NbEtablissementsProtegesPrimaires]: number;
	[CommunePropertiesKeys.SurfaceExploitableMaxTotal]: number;
	[CommunePropertiesKeys.SurfaceExploitableMaxPrimaires]: number;
	[CommunePropertiesKeys.PotentielSolaireTotal]: number;
	[CommunePropertiesKeys.PotentielSolairePrimaires]: number;
	[CommunePropertiesKeys.PotentielNbFoyersTotal]: number;
	[CommunePropertiesKeys.PotentielNbFoyersPrimaires]: number;
	[CommunePropertiesKeys.TopEtablissementsTotal]: Array<TopEtablissement>;
	[CommunePropertiesKeys.TopEtablissementsPrimaires]: Array<TopEtablissement>;
	[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielTotal]: NbEtablissementsByNiveauPotentiel;
	[CommunePropertiesKeys.NbEtablissementsParNiveauPotentielPrimaires]: NbEtablissementsByNiveauPotentiel;
};

// --- GeoJSON ----

/**
 * List of the Commune Feature type properties.
 */
export const CommuneFeaturePropertiesKeys = {
	Id: 'code_commune',
	Nom: 'nom_commune',
	CodeDepartement: 'code_departement',
	CodeRegion: 'code_region',
	PotentielSolaireTotal: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.TOTAL,
	PotentielSolaireLycees: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.LYCEES,
	PotentielSolaireColleges: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.COLLEGES,
	PotentielSolairePrimaires: ZONE_FEATURE_POTENTIEL_SOLAIRE_KEY.PRIMAIRES,
} as const;

export interface CommuneFeatureProperties {
	[CommuneFeaturePropertiesKeys.Id]: string;
	[CommuneFeaturePropertiesKeys.Nom]: string;
	[CommuneFeaturePropertiesKeys.CodeDepartement]: string;
	[CommuneFeaturePropertiesKeys.CodeRegion]: string;
	[CommuneFeaturePropertiesKeys.PotentielSolaireTotal]: number;
	[CommuneFeaturePropertiesKeys.PotentielSolaireLycees]: number;
	[CommuneFeaturePropertiesKeys.PotentielSolaireColleges]: number;
	[CommuneFeaturePropertiesKeys.PotentielSolairePrimaires]: number;
}
export type CommuneFeature = CommunesGeoJSON['features'][number];

export type CommunesGeoJSON = GeoJSON.FeatureCollection<
	GeoJSON.Polygon | GeoJSON.MultiPolygon,
	CommuneFeatureProperties
>;
