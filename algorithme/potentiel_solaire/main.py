import argparse
import os

import papermill as pm

from potentiel_solaire.constants import ALGORITHME_FOLDER
from potentiel_solaire.logger import get_logger

logger = get_logger()

codes_departement_choices = [
    '001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016',
    '017', '018', '019', '021', '022', '023', '024', '025', '026', '027', '028', '029', '02A', '02B', '030', '031',
    '032', '033', '034', '035', '036', '037', '038', '039', '040', '041', '042', '043', '044', '045', '046', '047',
    '048', '049', '050', '051', '052', '053', '054', '055', '056', '057', '058', '059', '060', '061', '062', '063',
    '064', '065', '066', '067', '068', '069', '070', '071', '072', '073', '074', '075', '076', '077', '078', '079',
    '080', '081', '082', '083', '084', '085', '086', '087', '088', '089', '090', '091', '092', '093', '094', '095',
    '971', '972', '973', '974', '975', '976', '977', '978', '986', '987', '988'
]


def run_pipeline_algorithme():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-d",
        "--code_departement",
        required=False,
        default="093",
        choices=codes_departement_choices
    )

    args = parser.parse_args()
    code_departement = args.code_departement

    notebooks_folder = ALGORITHME_FOLDER / "notebooks"
    exports_folder = notebooks_folder / "exports"
    exports_folder.mkdir(exist_ok=True)

    pm.execute_notebook(
        os.path.join(notebooks_folder, "pipeline_algorithme.ipynb"),
        os.path.join(exports_folder, f"{code_departement}_pipeline_algorithme.ipynb"),
        parameters={"code_departement": code_departement,
                    "logs_level": "WARNING"},
    )


if __name__ == "__main__":
    run_pipeline_algorithme()
