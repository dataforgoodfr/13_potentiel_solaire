import { CommuneFeaturePropertiesKeys, CommunePropertiesKeys } from '../models/communes';
import {
	DepartementFeaturePropertiesKeys,
	DepartementPropertiesKeys,
} from '../models/departements';
import {
	EtablissementFeaturePropertiesKeys,
	EtablissementPropertiesKeys,
} from '../models/etablissements';
import { RegionFeaturePropertiesKeys, RegionPropertiesKeys } from '../models/regions';
import { SearchPropertiesKeys } from '../models/search';

export const ETABLISSEMENTS_TABLE = 'etablissements';

export const EtablissementsColumns = {
	Id: 'identifiant_de_l_etablissement',
	Nom: 'nom_etablissement',
	Type: 'type_etablissement',
	LibelleNature: 'libelle_nature',
	CodeCommune: 'code_commune',
	NomCommune: 'nom_commune',
	CodeDepartement: 'code_departement',
	LibelleDepartement: 'libelle_departement',
	CodeRegion: 'code_region',
	LibelleRegion: 'libelle_region',
	SurfaceExploitableMax: 'surface_exploitable_max',
	PotentielSolaire: 'potentiel_solaire',
	PotentielNbFoyers: 'potentiel_nb_foyers',
	Protection: 'protection',
	NbEleves: 'nb_eleves',
	Adresse1: 'adresse_1',
	Adresse2: 'adresse_2',
	Adresse3: 'adresse_3',
	CodePostal: 'code_postal',
	NiveauPotentiel: 'niveau_potentiel',
	Geometry: 'geom',
} as const;

export const ETABLISSEMENTS_MAPPING = {
	[EtablissementsColumns.Id]: EtablissementPropertiesKeys.Id,
	[EtablissementsColumns.Nom]: EtablissementPropertiesKeys.Nom,
	[EtablissementsColumns.Type]: EtablissementPropertiesKeys.Type,
	[EtablissementsColumns.LibelleNature]: EtablissementPropertiesKeys.LibelleNature,
	[EtablissementsColumns.CodeCommune]: EtablissementPropertiesKeys.CodeCommune,
	[EtablissementsColumns.NomCommune]: EtablissementPropertiesKeys.NomCommune,
	[EtablissementsColumns.CodeDepartement]: EtablissementPropertiesKeys.CodeDepartement,
	[EtablissementsColumns.LibelleDepartement]: EtablissementPropertiesKeys.LibelleDepartement,
	[EtablissementsColumns.CodeRegion]: EtablissementPropertiesKeys.CodeRegion,
	[EtablissementsColumns.LibelleRegion]: EtablissementPropertiesKeys.LibelleRegion,
	[EtablissementsColumns.SurfaceExploitableMax]:
		EtablissementPropertiesKeys.SurfaceExploitableMax,
	[EtablissementsColumns.PotentielSolaire]: EtablissementPropertiesKeys.PotentielSolaire,
	[EtablissementsColumns.PotentielNbFoyers]: EtablissementPropertiesKeys.PotentielNbFoyers,
	[EtablissementsColumns.Protection]: EtablissementPropertiesKeys.Protection,
	[EtablissementsColumns.NbEleves]: EtablissementPropertiesKeys.NbEleves,
	[EtablissementsColumns.Adresse1]: EtablissementPropertiesKeys.Adresse1,
	[EtablissementsColumns.Adresse2]: EtablissementPropertiesKeys.Adresse2,
	[EtablissementsColumns.Adresse3]: EtablissementPropertiesKeys.Adresse3,
	[EtablissementsColumns.CodePostal]: EtablissementPropertiesKeys.CodePostal,
	[EtablissementsColumns.NiveauPotentiel]: EtablissementPropertiesKeys.NiveauPotentiel,
} as const;

export const ETABLISSEMENTS_GEOJSON_MAPPING = {
	[EtablissementsColumns.Id]: EtablissementFeaturePropertiesKeys.Id,
	[EtablissementsColumns.Nom]: EtablissementFeaturePropertiesKeys.Nom,
	[EtablissementsColumns.CodeCommune]: EtablissementFeaturePropertiesKeys.CodeCommune,
	[EtablissementsColumns.CodeDepartement]: EtablissementFeaturePropertiesKeys.CodeDepartement,
	[EtablissementsColumns.CodeRegion]: EtablissementFeaturePropertiesKeys.CodeRegion,
	[EtablissementsColumns.PotentielSolaire]: EtablissementFeaturePropertiesKeys.PotentielSolaire,
	[EtablissementsColumns.Protection]: EtablissementFeaturePropertiesKeys.Protection,
} as const;

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

export const SEARCH_VIEW_TABLE = 'search_view';
export const SearchViewColumns = {
	Source: 'source_table',
	Id: 'id',
	Libelle: 'libelle',
	SanitizedLibelle: 'sanitized_libelle',
	ExtraData: 'extra_data',
	ExtraDataNomCommune: 'nom_commune',
	ExtraDataCodePostal: 'code_postal',
} as const;

export const SEARCH_VIEW_MAPPING = {
	[SearchViewColumns.Source]: SearchPropertiesKeys.Source,
	[SearchViewColumns.Id]: SearchPropertiesKeys.Id,
	[SearchViewColumns.Libelle]: SearchPropertiesKeys.Libelle,
	[SearchViewColumns.ExtraData]: SearchPropertiesKeys.ExtraData,
	[SearchViewColumns.ExtraDataNomCommune]: SearchPropertiesKeys.ExtraDataNomCommune,
	[SearchViewColumns.ExtraDataCodePostal]: SearchPropertiesKeys.ExtraDataCodePostal,
} as const;
export const SEARCH_VIEW_SANITIZED_LIBELLE_COLUMN = 'sanitized_libelle';

export const REF_CODE_POSTAL_TABLE = 'ref_code_postal';
export const RefCodePostalColumns = {
	CodeInsee: 'code_insee',
	CodePostal: 'code_postal',
} as const;
