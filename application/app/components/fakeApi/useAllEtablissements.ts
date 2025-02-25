import type { FeatureCollection, Geometry } from "geojson";
import { useEffect, useState } from "react";
import { TerritoryProperties } from "../types/territoryProperties";

async function fetchAllEtablissements() {
  // TODO - faire une vraie API pour ne pas avoir le fichier dans public
  const etablissementsResponse = await fetch("data/etablissements.geojson");

  if (etablissementsResponse.status !== 200) {
    throw new Error(etablissementsResponse.status.toString());
  }

  return etablissementsResponse.json();
}

export function useAllEtablissements() {
  const [data, setData] =
    useState<FeatureCollection<Geometry, TerritoryProperties>>();

  useEffect(() => {
    fetchAllEtablissements().then(setData).catch(console.error);
  }, [setData]);

  return data?.features;
}
