'use client';

import { useEffect, useState } from 'react';

import { CommuneProperties } from '@/app/models/communes';
import { DepartementProperties } from '@/app/models/departements';
import { EtablissementFeature } from '@/app/models/etablissements';
import { RegionProperties } from '@/app/models/regions';
import { fetchCommunesGeoJSON } from '@/app/utils/fetchers/fetchCommunesGeoJSON';
import { fetchDepartementsGeoJSON } from '@/app/utils/fetchers/fetchDepartementsGeoJSON';
import { fetchRegionsGeoJSON } from '@/app/utils/fetchers/fetchRegionsGeoJSON';

export default function useSelectedTerritoires(selectedEtablissement: EtablissementFeature | null) {
	const [commune, setCommune] = useState<CommuneProperties | null>(null);
	const [departement, setDepartement] = useState<DepartementProperties | null>(null);
	const [region, setRegion] = useState<RegionProperties | null>(null);

	useEffect(() => {
		const loadTerritoires = async () => {
			if (!selectedEtablissement) {
				setCommune(null);
				setDepartement(null);
				setRegion(null);
				return;
			}

			const { code_commune, code_departement, code_region } =
				selectedEtablissement.properties;

			try {
				// Commune
				const communesData = await fetchCommunesGeoJSON(code_departement);
				const foundCommune = communesData.features.find(
					(f) => f.properties.code_commune === code_commune,
				);
				setCommune(foundCommune?.properties ?? null);

				// Département
				const departementsData = await fetchDepartementsGeoJSON(code_region);
				const foundDepartement = departementsData.features.find(
					(f) => f.properties.code_departement === code_departement,
				);
				setDepartement(foundDepartement?.properties ?? null);

				// Région
				const regionsData = await fetchRegionsGeoJSON();
				const foundRegion = regionsData.features.find(
					(f) => f.properties.code_region === code_region,
				);
				setRegion(foundRegion?.properties ?? null);
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
