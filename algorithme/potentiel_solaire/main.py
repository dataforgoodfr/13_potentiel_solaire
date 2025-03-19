import argparse
import traceback

import papermill as pm
from papermill.exceptions import PapermillExecutionError

from potentiel_solaire.constants import ALGORITHME_FOLDER, RESULTS_FOLDER
from potentiel_solaire.duckdb_manager import (
    get_departements, get_regions,
    get_departements_for_region,
    save_solar_potential_by_region,
)
from potentiel_solaire.logger import get_logger

logger = get_logger()


def run_pipeline_algorithme():
    """Script principal pour realiser les calculs de potentiel solaire"""
    codes_departements = get_departements()
    codes_regions = get_regions()

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-d",
        "--code_departement",
        required=False,
        choices=codes_departements
    )

    parser.add_argument(
        "-r",
        "--code_region",
        required=False,
        choices=codes_regions
    )

    parser.add_argument(
        "--all",
        action="store_true",
        help="run pipeline on all departements",
    )

    notebooks_folder = ALGORITHME_FOLDER / "notebooks"
    exports_folder = notebooks_folder / "exports"
    exports_folder.mkdir(exist_ok=True)

    # parse arguments
    args = parser.parse_args()
    code_departement = args.code_departement
    code_region = args.code_region
    run_on_france = args.all

    # selection des departements sur lesquels les calculs vont se faire
    if run_on_france:
        run_on_departements = codes_departements
    elif code_departement:
        run_on_departements = [code_departement]
    elif code_region:
        departements_of_region = get_departements_for_region(code_region=code_region)
        run_on_departements = departements_of_region
    else:
        raise ValueError("No arguments provided")

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

    # aggregation des resultats pour les regions
    agg_on_regions = []
    if run_on_france:
        agg_on_regions = codes_regions
    elif code_region:
        agg_on_regions.append(code_region)

    for region in agg_on_regions:
        logger.info("Aggregation on region %s", region)
        save_solar_potential_by_region(code_region=region)


if __name__ == "__main__":
    run_pipeline_algorithme()
