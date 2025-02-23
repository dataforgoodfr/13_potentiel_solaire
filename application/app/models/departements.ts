export interface DepartementProperties {
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
export type Departement = Departements["features"][number];

export type Departements = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  DepartementProperties
>;
