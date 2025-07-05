import traceback

import papermill as pm
import click

from papermill.exceptions import PapermillExecutionError

from potentiel_solaire.constants import ALGORITHME_FOLDER, RESULTS_FOLDER
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
from potentiel_solaire.etl.extract import extract_pipeline
from potentiel_solaire.etl.transform import attach_buildings_to_schools_pipeline
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
    """Script principal pour extraire les donnees necessaires au calcul du potentiel solaire"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )
    
    extract_pipeline(
        codes_departement=run_on_departements
    )


@cli.command()
@click.option("--code_departement", "-d", default=None, help="Code departement", type=click.Choice(get_departements()))
@click.option("--code_region", "-r", default=None, help="Code region", type=click.Choice(get_regions()))
@click.option("--all_departements", "-a", is_flag=True, help="Run pipeline on all departements")
def attach_buildings_to_schools(
    code_departement: str = None,
    code_region: str = None,
    all_departements: bool = False,
):
    """Script principal pour attacher les batiments aux ecoles"""
    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    attach_buildings_to_schools_pipeline(codes_departement=run_on_departements)


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
    notebooks_folder = ALGORITHME_FOLDER / "notebooks"

    exports_folder = notebooks_folder / "exports"
    exports_folder.mkdir(exist_ok=True)

    RESULTS_FOLDER.mkdir(exist_ok=True)

    # selection des departements sur lesquels les calculs vont se faire
    run_on_departements = departements_to_run(
        code_departement=code_departement,  
        code_region=code_region,
        all_departements=all_departements,
    )

    # calcul du potentiel solaire de chaque departement
    notebook_pipeline_algorithm_path = notebooks_folder / "pipeline_algorithme.ipynb"
    for departement in run_on_departements:
        notebook_result_pipeline_algorithm_path = exports_folder / f"D{departement}_pipeline_algorithme.ipynb"
        error_file_path = RESULTS_FOLDER / f"D{departement}.err"
        error_file_path.unlink(missing_ok=True)
        try:
            # on execute le notebook pipeline_algorithme.ipynb pour chaque departement
            # un notebook resultat sera cree dans le dossier d export pour chaque departement
            pm.execute_notebook(
                notebook_pipeline_algorithm_path,
                notebook_result_pipeline_algorithm_path,
                parameters={"code_departement": departement},
            )
        except PapermillExecutionError as e:
            logger.exception(e)
            logger.error(
                "Exception %s, go check notebook %s for more details.",
                str(e),
                f"D{departement}_pipeline_algorithme.ipynb"
                )
            # en cas d erreur un fichier d erreur est cree dans le dossier result avec la trace de l exception
            with open(error_file_path, "w") as error_file:
                error_file.write(traceback.format_exc())


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
