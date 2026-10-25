"""This module is used to query the IGN Geoplateforme download API
(https://data.geopf.fr/telechargement/) to get datasets and download links"""

import re
import xml.etree.ElementTree as ET

import feedparser
import requests

from potentiel_solaire.constants import GEOPF_BASE_URL
from potentiel_solaire.logger import get_logger

logger = get_logger()

GEOPF_NAMESPACE_URI = "https://data.geopf.fr/annexes/ressources/xsd/gpf_dl.xsd"
REQUEST_TIMEOUT = 60  # seconds


def get_geopf_resource_entries(
    resource_id: str,
    page_size: int = 50,
    zone: str = None,
    edition_date_from: str = None,
    edition_date_to: str = None,
    crs: str = None,
    fmt: str = None,
) -> list[dict]:
    """Fetch dataset entries for a resource from the Geoplateforme API.

    The API returns paginated Atom feeds. Each <entry> describes one downloadable
    dataset (e.g. one departement x one edition date x one format). feedparser maps
    the custom gpf_dl: namespace elements to entry.gpf_dl_* attributes.

    :param resource_id: resource identifier (e.g. "BDTOPO")
    :param page_size: number of entries per page (max 50 per API limit)
    :param zone: optional zone filter (e.g. "D075" for Paris, "FRA" for France)
    :param edition_date_from: optional start date filter (YYYY-MM-DD)
    :param edition_date_to: optional end date filter (YYYY-MM-DD)
    :param crs: optional CRS filter (e.g. "EPSG:2154")
    :param fmt: optional format filter (e.g. "GPKG")
    :return: list of dicts with keys resource_id, title, id, zone, format, edition_date
    """
    filters = {"lang": "fre"}
    if zone:
        filters["zone"] = zone
    if edition_date_from:
        filters["editionDateFrom"] = edition_date_from
    if edition_date_to:
        filters["editionDateTo"] = edition_date_to
    if crs:
        filters["crs"] = crs
    if fmt:
        filters["format"] = fmt

    entries = []
    page = 1
    while True:
        params = {**filters, "page": page, "limit": page_size}
        response = requests.get(
            f"{GEOPF_BASE_URL}/resource/{resource_id}",
            params=params,
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()
        xml_text = response.text

        feed = feedparser.parse(xml_text)
        for entry in feed.entries:
            # gpf_dl_zone and gpf_dl_format are dicts, e.g. {'term': 'D075', 'label': 'D075 Paris'}
            entry_zone = entry.get("gpf_dl_zone")
            entry_fmt = entry.get("gpf_dl_format")
            entries.append(
                {
                    "resource_id": resource_id,
                    "title": entry.get("title"),
                    "id": entry.get("id"),
                    "zone": entry_zone.get("term") if entry_zone else None,
                    "format": entry_fmt.get("term") if entry_fmt else None,
                    "edition_date": entry.get("gpf_dl_editiondate"),
                }
            )

        # gpf_dl:pagecount is an attribute of the root <feed> element,
        # which feedparser does not expose, so we read it with ElementTree
        root = ET.fromstring(xml_text)
        page_count = int(root.get(f"{{{GEOPF_NAMESPACE_URI}}}pagecount", 1))

        if page >= page_count:
            break
        page += 1

    return entries


def get_geopf_download_links(resource_id: str, dataset_id: str) -> list[str]:
    """Fetch the download urls (.7z archive or .7z.001, .7z.002, ... parts) of a dataset.

    :param resource_id: resource identifier (e.g. "BDTOPO")
    :param dataset_id: dataset title from get_geopf_resource_entries
        (e.g. "BDTOPO_3-4_TOUSTHEMES_GPKG_LAMB93_D033_2025-03-15")
    :return: sorted list of download urls
    """
    response = requests.get(
        f"{GEOPF_BASE_URL}/resource/{resource_id}/{dataset_id}",
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    feed = feedparser.parse(response.text)

    links = []
    for entry in feed.entries:
        for link in entry.get("links", []):
            href = link.get("href", "")
            if re.search(r"\.7z(\.\d+)?$", href):
                links.append(href)

    return sorted(links)
