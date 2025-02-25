import { useEffect, useState } from "react";
import { Topology } from "topojson-specification";

const URL_TOPOJSON =
  "https://static.data.gouv.fr/resources/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/20220219-094943/a-com2022-topo.json";

async function fetchTopoJson() {
  const response = await fetch(URL_TOPOJSON);
  const data = await response.json();

  return data as Topology;
}

/**
 * Hook to get the topojson of the 'contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches'
 * @returns
 */
export function useTopoJsonData() {
  const [data, setData] = useState<Topology>();

  useEffect(() => {
    fetchTopoJson().then(setData).catch(console.error);
  }, [setData]);

  return data;
}
