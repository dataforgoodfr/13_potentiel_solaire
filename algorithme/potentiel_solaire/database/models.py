from dataclasses import dataclass


@dataclass
class Table:
    name: str
    pkey: str

# schema
etablissements_table = Table(
    name="etablissements", 
    pkey="identifiant_de_l_etablissement"
)
communes_table = Table(
    name="communes", 
    pkey="code_commune"
)
departements_table = Table(
    name="departements", 
    pkey="code_departement"
)
regions_table = Table(
    name="regions", 
    pkey="code_region"
)
seuils_niveaux_potentiels_table = Table(
    name="seuils_niveaux_potentiels", 
    pkey="niveau_potentiel"
)
