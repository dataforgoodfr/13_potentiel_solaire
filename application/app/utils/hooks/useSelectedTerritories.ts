'use client';

import { useEffect, useState } from 'react';

import { Commune } from '@/app/models/communes';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';

async function fetchCommune(id: string): Promise<Commune | null> {
	try {
		const res = await fetch(`/api/communes/${id}`);
		if (!res.ok) return null;
		return await res.json();
	} catch (err) {
		console.error('Erreur fetch commune:', err);
		return null;
	}
}

async function fetchDepartement(id: string): Promise<Departement | null> {
	try {
		const res = await fetch(`/api/departements/${id}`);
		if (!res.ok) return null;
		return await res.json();
	} catch (err) {
		console.error('Erreur fetch département:', err);
		return null;
	}
}

async function fetchRegion(id: string): Promise<Region | null> {
	try {
		const res = await fetch(`/api/regions/${id}`);
		if (!res.ok) return null;
		return await res.json();
	} catch (err) {
		console.error('Erreur fetch région:', err);
		return null;
	}
}

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

			const [communeData, departementData, regionData] = await Promise.all([
				fetchCommune(code_commune),
				fetchDepartement(code_departement),
				fetchRegion(code_region),
			]);

			setCommune(communeData);
			setDepartement(departementData);
			setRegion(regionData);
		};

		loadTerritoires();
	}, [selectedEtablissement]);

	return { commune, departement, region };
}
