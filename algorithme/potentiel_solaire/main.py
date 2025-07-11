import click

from potentiel_solaire.constants import RESULTS_FOLDER
from potentiel_solaire.database.queries import (
    check_if_results_for_schools_are_exhaustive,
    get_departements, 
    get_regions,
    get_departements_for_region,
    update_indicators_for_communes,
    update_indicators_for_departements,
    update_indicators_for_regions, 
    update_indicators_for_schools,
    get_high_priority_schools,
)
from potentiel_solaire.etl.extract import extract_data_for_departements
from potentiel_solaire.etl.load import load_buildings_attachment_results_to_db, load_protection_results_to_db, load_solar_potential_results_to_db
from potentiel_solaire.etl.transform import calculate_attach_buildings_to_schools, calculate_protection_for_buildings, calculate_solar_potential_for_buildings
from potentiel_solaire.logger import get_logger

logger = get_logger()


def departements_to_run(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
) -> list[str]:
    """Function to get the list of departements to run the pipeline on."""
    if all_departements:
        return get_departements()
    elif code_departement:
        return [code_departement]
    elif code_region:
        departements_of_region = get_departements_for_region(code_region=code_region)
        return departements_of_region
    else:
        raise ValueError("No arguments provided")


@click.group()
def cli():
    """Main entry point for CLI."""
    pass


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def extract_data(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script pour extraire les donnees necessaires au calcul du potentiel solaire"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )
    
    extract_data_for_departements(codes_departement=run_on_departements)


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def attach_buildings_to_schools(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script pour attacher les batiments aux ecoles"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # calcule des rattachements des batiments aux ecoles
    calculate_attach_buildings_to_schools(codes_departement=run_on_departements)

    # charge des resultats de rattachement des batiments aux ecoles dans la base de donnees
    load_buildings_attachment_results_to_db(codes_departement=run_on_departements)


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def calculate_protection_for_schools(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script pour determiner les ecoles en zone protegee"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # calcul du tag protection des batiments scolaires
    calculate_protection_for_buildings(codes_departement=run_on_departements)

    # charge des resultats de protection des ecoles dans la base de donnees
    load_protection_results_to_db(codes_departement=run_on_departements)


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def calculate_solar_potential_for_schools(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script pour calculer le potentiel solaire des ecoles"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # calcul du potentiel solaire des batiments scolaires
    calculate_solar_potential_for_buildings(codes_departement=run_on_departements)

    # charge des resultats de potentiel solaire des ecoles dans la base de donnees
    load_solar_potential_results_to_db(codes_departement=run_on_departements)


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def load_results_to_db(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script pour charger les resultats dans la base de donnees"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # charge des resultats de rattachement des batiments aux ecoles dans la base de donnees
    load_buildings_attachment_results_to_db(codes_departement=run_on_departements)

    # charge des resultats de protection des ecoles dans la base de donnees
    load_protection_results_to_db(codes_departement=run_on_departements)

    # charge des resultats de potentiel solaire des ecoles dans la base de donnees
    load_solar_potential_results_to_db(codes_departement=run_on_departements)


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def calculate_for_schools(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script principal pour realiser les calculs de potentiel solaire"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # pipeline de calcul pour les ecoles
    
    # extract
    extract_data_for_departements(codes_departement=run_on_departements)

    # transform
    calculate_attach_buildings_to_schools(codes_departement=run_on_departements)
    calculate_protection_for_buildings(codes_departement=run_on_departements)
    calculate_solar_potential_for_buildings(codes_departement=run_on_departements)

    # load
    load_buildings_attachment_results_to_db(codes_departement=run_on_departements)
    load_protection_results_to_db(codes_departement=run_on_departements)
    load_solar_potential_results_to_db(codes_departement=run_on_departements)


@cli.command()
def update_database_indicators():
    """Met à jour les indicateurs dans la base de donnees utilisee par l application"""
    check_if_results_for_schools_are_exhaustive()

    update_indicators_for_schools()
    update_indicators_for_communes()
    update_indicators_for_departements()
    update_indicators_for_regions()


@cli.command()
def save_high_priority_schools():
    """Recupere les ecoles a fort potentiel solaire et les sauvegarde dans un fichier."""
    high_priority_schools = get_high_priority_schools()
    high_priority_schools.to_csv(RESULTS_FOLDER / "high_priority_schools.csv", index=False)
    logger.info("High priority schools saved to %s", RESULTS_FOLDER / "high_priority_schools.csv")


if __name__ == "__main__":
    cli()
