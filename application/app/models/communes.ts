export interface CommuneProperties {
  code_commune: string;
  nom_commune: string;
  code_departement: string;
  libelle_departement: string;
  code_region: string;
  libelle_region: string;
  surface_utile: number;
  rayonnement_solaire: number;
  potentiel_solaire: number;
  protection: boolean;
  count_etablissements: number;
}
export type Commune = Communes["features"][number];

export type Communes = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  CommuneProperties
>;
