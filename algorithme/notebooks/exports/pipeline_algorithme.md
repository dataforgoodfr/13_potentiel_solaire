```python
%load_ext autoreload
%autoreload 2
```

# Paramètres de la pipeline


```python
code_departement = "093"
logs_level = "WARNING"
```

# Imports & setup


```python
import geopandas as gpd

from potentiel_solaire.attach_buildings_to_schools import attach_buildings_to_schools
from potentiel_solaire.constants import CRS, ALGORITHME_FOLDER, DATA_FOLDER
from potentiel_solaire.sources.bd_topo import extract_bd_topo, get_topo_zones_of_interest, \
    get_topo_buildings_of_interest
from potentiel_solaire.sources.schools_establishments import extract_schools_establishments, \
    get_schools_establishments_of_interest
from potentiel_solaire.features.solar_potential import calculate_solar_potential
from potentiel_solaire.aggregate import aggregate_solar_potential_by
from potentiel_solaire.logger import get_logger

logger = get_logger()
logger.setLevel(logs_level)
```

# Extraction des données sources

### Etablissements scolaires


```python
schools_establishments_path = extract_schools_establishments()
print(f"Annuaire des établissements scolaires extrait ici: {schools_establishments_path}")
```

    Annuaire des établissements scolaires extrait ici: /home/kelu/projets/13_potentiel_solaire/algorithme/data/fr-en-annuaire-education.geojson


### BD TOPO


```python
bd_topo_path = extract_bd_topo(code_departement=code_departement)
print(f"BD TOPO extraite ici: {bd_topo_path}")
```

    BD TOPO extraite ici: /home/kelu/projets/13_potentiel_solaire/algorithme/data/BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D093_2024-12-15/BDTOPO/1_DONNEES_LIVRAISON_2024-12-00134/BDT_3-4_GPKG_LAMB93_D093-ED2024-12-15/BDT_3-4_GPKG_LAMB93_D093-ED2024-12-15.gpkg




### BD PCI


```python
#TODO: recuperer les données PCI pour le département
```

# Filtre des données sur le périmètre du calcul

### Etablissements scolaires



```python
schools_establishments = get_schools_establishments_of_interest(
    schools_filepath=schools_establishments_path,
    code_departement=code_departement,
    types_etablissements=['Ecole', 'Lycée', 'Collège'],
    statut_public_prive="Public",
    etat="OUVERT",
    crs=CRS
)
nb_schools = schools_establishments.shape[0]
print(f"Nb d'établissements scolaires: {nb_schools}")
```

    Nb d'établissements scolaires: 1130


### Zone d'intérêt géographique


```python
codes_commune = schools_establishments["code_commune"].unique()
communes = gpd.read_file(bd_topo_path, layer="commune").to_crs(CRS)
communes = communes[communes.code_insee.isin(codes_commune)]
geom_of_interest = communes.dissolve()[["geometry"]]
```

### Zones d'éducations


```python
educational_zones = get_topo_zones_of_interest(
    bd_topo_path=bd_topo_path,
    geom_of_interest=geom_of_interest,
    categories=["Science et enseignement"],
    natures=['Collège', 'Lycée', 'Enseignement primaire'],
    crs=CRS
)
nb_educational_zones = educational_zones.shape[0]
print("Nb de zones d'éducations: ", nb_educational_zones)
```

    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying(256)' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying(30)' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'timestamp with time zone' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/geopandas/io/file.py:497: UserWarning: More than one layer found in 'BDT_3-4_GPKG_LAMB93_D093-ED2024-12-15.gpkg': 'troncon_de_route' (default), 'route_numerotee_ou_nommee', 'itineraire_autre', 'troncon_de_voie_ferree', 'equipement_de_transport', 'piste_d_aerodrome', 'aerodrome', 'point_de_repere', 'non_communication', 'point_du_reseau', 'voie_ferree_nommee', 'toponymie_transport', 'batiment', 'cimetiere', 'construction_lineaire', 'construction_ponctuelle', 'construction_surfacique', 'reservoir', 'ligne_orographique', 'pylone', 'terrain_de_sport', 'toponymie_bati', 'cours_d_eau', 'troncon_hydrographique', 'bassin_versant_topographique', 'plan_d_eau', 'surface_hydrographique', 'noeud_hydrographique', 'detail_hydrographique', 'toponymie_hydrographie', 'zone_d_habitation', 'lieu_dit_non_habite', 'detail_orographique', 'toponymie_lieux_nommes', 'canalisation', 'ligne_electrique', 'poste_de_transformation', 'erp', 'zone_d_activite_ou_d_interet', 'toponymie_services_et_activites', 'voie_nommee', 'parc_ou_reserve', 'foret_publique', 'toponymie_zones_reglementees', 'haie', 'zone_de_vegetation', 'arrondissement', 'arrondissement_municipal', 'commune', 'epci', 'collectivite_territoriale', 'departement', 'region', 'adresse_ban', 'batiment_rnb_lien_bdtopo', 'lien_adresse_vers_bdtopo', 'section_de_points_de_repere', 'info_metadonnees', 'metadonnees_lot', 'metadonnees_theme', 'layer_styles'. Specify layer parameter to avoid this warning.
      crs = pyogrio.read_info(path_or_bytes).get("crs")


    Nb de zones d'éducations:  1088


### Bâtiments


```python
# TODO : ajout des batiments manquants avec la BD PCI
buildings = get_topo_buildings_of_interest(
    bd_topo_path=bd_topo_path,
    geom_of_interest=geom_of_interest,
    crs=CRS
)
nb_buildings = buildings.shape[0]
print("Nb de batiments: ", nb_buildings)
```

    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying(256)' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'character varying(30)' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/pyogrio/core.py:279: RuntimeWarning: Field format 'timestamp with time zone' not supported
      return ogr_read_info(
    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/geopandas/io/file.py:497: UserWarning: More than one layer found in 'BDT_3-4_GPKG_LAMB93_D093-ED2024-12-15.gpkg': 'troncon_de_route' (default), 'route_numerotee_ou_nommee', 'itineraire_autre', 'troncon_de_voie_ferree', 'equipement_de_transport', 'piste_d_aerodrome', 'aerodrome', 'point_de_repere', 'non_communication', 'point_du_reseau', 'voie_ferree_nommee', 'toponymie_transport', 'batiment', 'cimetiere', 'construction_lineaire', 'construction_ponctuelle', 'construction_surfacique', 'reservoir', 'ligne_orographique', 'pylone', 'terrain_de_sport', 'toponymie_bati', 'cours_d_eau', 'troncon_hydrographique', 'bassin_versant_topographique', 'plan_d_eau', 'surface_hydrographique', 'noeud_hydrographique', 'detail_hydrographique', 'toponymie_hydrographie', 'zone_d_habitation', 'lieu_dit_non_habite', 'detail_orographique', 'toponymie_lieux_nommes', 'canalisation', 'ligne_electrique', 'poste_de_transformation', 'erp', 'zone_d_activite_ou_d_interet', 'toponymie_services_et_activites', 'voie_nommee', 'parc_ou_reserve', 'foret_publique', 'toponymie_zones_reglementees', 'haie', 'zone_de_vegetation', 'arrondissement', 'arrondissement_municipal', 'commune', 'epci', 'collectivite_territoriale', 'departement', 'region', 'adresse_ban', 'batiment_rnb_lien_bdtopo', 'lien_adresse_vers_bdtopo', 'section_de_points_de_repere', 'info_metadonnees', 'metadonnees_lot', 'metadonnees_theme', 'layer_styles'. Specify layer parameter to avoid this warning.
      crs = pyogrio.read_info(path_or_bytes).get("crs")


    Nb de batiments:  351578


# Détermination des bâtiments scolaires


```python
schools_buildings = attach_buildings_to_schools(
        schools_establishments=schools_establishments,
        educational_zones=educational_zones,
        buildings=buildings
)
```

    /home/kelu/projets/13_potentiel_solaire/algorithme/.venv/lib/python3.10/site-packages/geopandas/array.py:403: UserWarning: Geometry is in a geographic CRS. Results from 'sjoin_nearest' are likely incorrect. Use 'GeoSeries.to_crs()' to re-project geometries to a projected CRS before this operation.
    
      warnings.warn(


# Calcul des attributs utiles pour le potentiel solaire


```python
# TODO: v0 seulement à ce stade
solar_potential_of_schools_buildings = calculate_solar_potential(
    schools_buildings=schools_buildings,
)
```

# Check nos calculs vs potentiel solaire des toitures


```python
bool_Audit = False
```


```python
if code_departement == "093" and bool_Audit:
    # Audit des données sur Département 93
    GPKG = DATA_FOLDER / "potentiel-solaire.geojson"
    gspsdt_total = gpd.read_file(GPKG)
    print(len(gspsdt_total),"batiments")
    gspsdt_total=  gspsdt_total.to_crs(4326)
```

    2450931





<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>objectid</th>
      <th>id</th>
      <th>nature</th>
      <th>surf_util</th>
      <th>indic2</th>
      <th>gisement</th>
      <th>eq_pano</th>
      <th>eq_surf</th>
      <th>systeme</th>
      <th>protection</th>
      <th>mos2017</th>
      <th>insee</th>
      <th>moyenne2</th>
      <th>forme</th>
      <th>production</th>
      <th>mos17</th>
      <th>st_areashape</th>
      <th>st_lengthshape</th>
      <th>geometry</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>BATIMENT0000000356480536</td>
      <td>Bâtiment industriel</td>
      <td>382.50</td>
      <td>3</td>
      <td>important</td>
      <td>plus de 50 panneaux</td>
      <td>plus de 115 m2</td>
      <td>thermique ou photovoltaïque</td>
      <td>0</td>
      <td>45.0</td>
      <td>95078.0</td>
      <td>1210.328054</td>
      <td>plat</td>
      <td>42184.047797</td>
      <td>5.0</td>
      <td>609.870</td>
      <td>108.056166</td>
      <td>POLYGON ((2.03865 49.08767, 2.03867 49.08767, ...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>BATIMENT0000000356480545</td>
      <td>Bâtiment industriel</td>
      <td>83.25</td>
      <td>2</td>
      <td>intermédiaire</td>
      <td>10 à 50 panneaux</td>
      <td>entre 20 et 115 m2</td>
      <td>thermique ou photovoltaïque</td>
      <td>0</td>
      <td>45.0</td>
      <td>95078.0</td>
      <td>1197.261665</td>
      <td>Npans</td>
      <td>12199.856914</td>
      <td>5.0</td>
      <td>159.180</td>
      <td>51.796212</td>
      <td>POLYGON ((2.04011 49.08265, 2.04006 49.08257, ...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>BATIMENT0000000356475551</td>
      <td>Bâtiment industriel</td>
      <td>213.75</td>
      <td>3</td>
      <td>important</td>
      <td>plus de 50 panneaux</td>
      <td>plus de 115 m2</td>
      <td>thermique ou photovoltaïque</td>
      <td>1</td>
      <td>45.0</td>
      <td>95211.0</td>
      <td>1204.673158</td>
      <td>plat</td>
      <td>23463.298631</td>
      <td>5.0</td>
      <td>713.220</td>
      <td>115.314199</td>
      <td>POLYGON ((2.1148 49.06608, 2.11477 49.06605, 2...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>BATIMENT0000000317228796</td>
      <td>Bâtiment industriel</td>
      <td>240.75</td>
      <td>3</td>
      <td>important</td>
      <td>plus de 50 panneaux</td>
      <td>plus de 115 m2</td>
      <td>thermique ou photovoltaïque</td>
      <td>1</td>
      <td>45.0</td>
      <td>95211.0</td>
      <td>1243.157793</td>
      <td>toit2pentes</td>
      <td>36633.125213</td>
      <td>5.0</td>
      <td>729.620</td>
      <td>119.633673</td>
      <td>POLYGON ((2.11964 49.06853, 2.11947 49.06864, ...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>BATIMENT0000000003786796</td>
      <td>Bâtiment industriel</td>
      <td>132.75</td>
      <td>3</td>
      <td>important</td>
      <td>plus de 50 panneaux</td>
      <td>plus de 115 m2</td>
      <td>thermique ou photovoltaïque</td>
      <td>1</td>
      <td>45.0</td>
      <td>95370.0</td>
      <td>1210.220040</td>
      <td>plat</td>
      <td>14639.039443</td>
      <td>5.0</td>
      <td>305.425</td>
      <td>74.696097</td>
      <td>POLYGON ((1.97282 49.14438, 1.97277 49.14436, ...</td>
    </tr>
  </tbody>
</table>
</div>




```python
if code_departement == "093" and bool_Audit:
    batiments_a_auditer = solar_potential_of_schools_buildings.cleabs_bat.unique()
    gspsdt = gspsdt_total[gspsdt_total.id.isin(batiments_a_auditer)]

    gspsdt = gspsdt[["id","st_areashape","surf_util","moyenne2","production"]]
    comparaison = gspsdt.merge(solar_potential_of_schools_buildings[["cleabs_bat","surface_totale_calculee","surface_utile","rayonnement_solaire","potentiel_solaire"]],\
             left_on='id', right_on='cleabs_bat', how="inner")
    
    total_ecole         = comparaison.production.sum()
    total_ecole_calcule = comparaison.potentiel_solaire.sum()
    print("# Verification des potentiels pour:",code_departement,"\n")
    print("* Verification effectuée sur:",len(comparaison),"batiments.")
    print("* BDD Potentiel solaire\t",int(total_ecole),"kWh/an")
    print("* Estimation ordre 0\t",int(total_ecole_calcule),"kWh/an")
    print("* Tentative accuracy\t",int(total_ecole/total_ecole_calcule*100),"%")
```

    # Verification des potentiels pour: 093 
    
    * Verification effectuée sur: 2612 batiments.
    * BDD Potentiel solaire	 73328015 kWh/an
    * Estimation ordre 0	 85376700 kWh/an
    * Tentative accuracy	 85 %


# Checks sur la qualité des données & calculs


```python
nb_schools_with_buildings = len(schools_buildings.identifiant_de_l_etablissement.unique())
print("Nb d'établissements scolaires avec des batiments: {} ({}%)".format(
    nb_schools_with_buildings,
    round(100 * nb_schools_with_buildings / nb_schools)
))
```

    Nb d'établissements scolaires avec des batiments: 445 (39%)


# Aggrégations

### Par établissement scolaire


```python
results_by_school = aggregate_solar_potential_by(
    schools_establishments=schools_establishments,
    solar_potential_of_schools_buildings=solar_potential_of_schools_buildings,
    group_by = [
        "identifiant_de_l_etablissement",
        "nom_etablissement",
        "type_etablissement",
        "libelle_nature",
        "code_commune",
        "nom_commune",
        "code_departement",
        "libelle_departement",
        "code_region",
        "libelle_region",
    ]
)
```

### Par commune


```python
results_by_commune = aggregate_solar_potential_by(
    schools_establishments=schools_establishments,
    solar_potential_of_schools_buildings=solar_potential_of_schools_buildings,
    group_by = [
        "code_commune",
        "nom_commune",
        "code_departement",
        "libelle_departement",
        "code_region",
        "libelle_region",
    ]
)
# TODO : la geometrie de la commune est fausse
```

### Par département


```python
results_by_departement = aggregate_solar_potential_by(
    schools_establishments=schools_establishments,
    solar_potential_of_schools_buildings=solar_potential_of_schools_buildings,
    group_by = [
        "code_departement",
        "libelle_departement",
        "code_region",
        "libelle_region",
    ]
)
# TODO : la geometrie du departement est fausse
```

### Par région


```python
# TODO : demande de se connecter au bucket avec les resultats existants pour aggreger 
# TODO : ou de faire le calcul pour tous les departements d une region
```

# Sauvegarde des fichiers


```python
output_folder = ALGORITHME_FOLDER.parent / "results" / f"D{code_departement}"
output_folder.mkdir(exist_ok=True, parents=True)

# TODO : a voir cote front sil faut changer le format de mise a disposition
results_by_school.to_file(output_folder / f"D{code_departement}_ecoles.geojson", driver="GeoJSON")
results_by_commune.to_file(output_folder / f"D{code_departement}_communes.geojson", driver="GeoJSON")
results_by_departement.to_file(output_folder / f"D{code_departement}_departement.geojson", driver="GeoJSON")
```
