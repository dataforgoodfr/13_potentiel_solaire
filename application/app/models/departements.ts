export interface DepartementProperties {
  code_departement: string;
  libelle_departement: string;
  code_region: string;
  libelle_region: string;
  surface_utile: number;
  potentiel_solaire: number;
  count_etablissements: number;
  count_etablissements_proteges: number;
}
export type Departement = Departements["features"][number];

export type Departements = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  DepartementProperties
>;
