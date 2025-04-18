'use client';

import { useEffect, useState } from 'react';

import { fetchCommuneById, fetchDepartementById, fetchRegionById } from '@/app/lib/data';
import { Commune } from '@/app/models/communes';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';

export default function useSelectedTerritoires(selectedEtablissement: Etablissement | null) {
	const [commune, setCommune] = useState<Commune | null>(null);
	const [departement, setDepartement] = useState<Departement | null>(null);
	const [region, setRegion] = useState<Region | null>(null);

	useEffect(() => {
		const loadTerritoires = async () => {
			if (!selectedEtablissement) {
				setCommune(null);
				setDepartement(null);
				setRegion(null);
				return;
			}

			const { code_commune, code_departement, code_region } = selectedEtablissement;

			try {
				const communeData = await fetchCommuneById(code_commune);
				setCommune(communeData ?? null);

				const departementData = await fetchDepartementById(code_departement);
				setDepartement(departementData ?? null);

				const regionData = await fetchRegionById(code_region);
				setRegion(regionData ?? null);
			} catch (error) {
				console.error('Erreur lors du chargement des territoires :', error);
				setCommune(null);
				setDepartement(null);
				setRegion(null);
			}
		};

		loadTerritoires();
	}, [selectedEtablissement]);

	return { commune, departement, region };
}
