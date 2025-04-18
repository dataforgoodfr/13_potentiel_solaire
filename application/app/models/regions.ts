import { REGIONS_MAPPING } from '../lib/db-mapping';
import { TopEtablissement } from './etablissements';

export interface RegionProperties {
	[REGIONS_MAPPING.code_region]: string;
	[REGIONS_MAPPING.libelle_region]: string;
	[REGIONS_MAPPING.surface_exploitable_max_lycees]: number;
	[REGIONS_MAPPING.nb_eleves_total]: number;
	[REGIONS_MAPPING.nb_eleves_lycees]: number;
	[REGIONS_MAPPING.nb_etablissements_total]: number;
	[REGIONS_MAPPING.nb_etablissements_lycees]: number;
	[REGIONS_MAPPING.nb_etablissements_proteges_total]: number;
	[REGIONS_MAPPING.nb_etablissements_proteges_lycees]: number;
	[REGIONS_MAPPING.potentiel_solaire_total]: number;
	[REGIONS_MAPPING.potentiel_solaire_lycees]: number;
	[REGIONS_MAPPING.potentiel_nb_foyers_total]: number;
	[REGIONS_MAPPING.potentiel_nb_foyers_lycees]: number;
	[REGIONS_MAPPING.top_etablissements_total]: Array<TopEtablissement> | null;
	[REGIONS_MAPPING.top_etablissements_lycees]: Array<TopEtablissement> | null;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionProperties>;
