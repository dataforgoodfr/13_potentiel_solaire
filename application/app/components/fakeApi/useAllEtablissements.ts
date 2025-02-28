import { Etablissement } from "@/app/models/etablissements";
import { useEffect, useState } from "react";

async function fetchAllEtablissements() {
  // TODO - faire une vraie API pour ne pas avoir le fichier dans public
  const etablissementsResponse = await fetch("api/get-etablissements", {
    method: "get",
  });

  if (etablissementsResponse.status !== 200) {
    throw new Error(etablissementsResponse.status.toString());
  }

  return etablissementsResponse.json() as Promise<Etablissement[]>;
}

export function useAllEtablissements() {
  const [data, setData] = useState<Etablissement[]>();

  useEffect(() => {
    fetchAllEtablissements().then(setData).catch(console.error);
  }, [setData]);

  return data;
}
