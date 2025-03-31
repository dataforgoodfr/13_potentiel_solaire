export interface RegionProperties {
	code_region: string;
	libelle_region: string;
	surface_utile: number;
	potentiel_solaire: number;
	count_etablissements: number;
	count_etablissements_proteges: number;
}
export type RegionFeature = RegionsGeoJSON['features'][number];

export type RegionsGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Polygon, RegionProperties>;
