export interface RegionProperties {
  code_region: string;
  libelle_region: string;
  surface_utile: number;
  rayonnement_solaire: number;
  potentiel_solaire: number;
  protection: boolean;
  count_etablissements: number;
}
export type Region = Regions["features"][number];

export type Regions = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  RegionProperties
>;
