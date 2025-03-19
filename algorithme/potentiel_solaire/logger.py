import logging


logger_init = False


def setup_logger():
    global logger_init
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(name)s - %(pathname)s - %(funcName)s - %(message)s',
        handlers=[logging.StreamHandler()]
    )
    logger_init = True
    return logging.getLogger()


def get_logger():
    global logger_init
    if not logger_init:
        setup_logger()
    return logging.getLogger()
