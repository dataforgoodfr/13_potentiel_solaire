'use client';

<<<<<<< HEAD
=======
import { useEffect, useState } from 'react';

>>>>>>> 900f4c1 (feat: create hook for data access)
import { CommuneProperties } from '@/app/models/communes';
import { DepartementProperties } from '@/app/models/departements';
import { EtablissementFeature } from '@/app/models/etablissements';
import { RegionProperties } from '@/app/models/regions';
<<<<<<< HEAD
import useCommunesGeoJSON from '@/app/utils/hooks/useCommunesGeoJSON';
import useDepartementsGeoJSON from '@/app/utils/hooks/useDepartementsGeoJSON';
import useRegionsGeoJSON from '@/app/utils/hooks/useRegionsGeoJSON';

export default function useSelectedTerritoires(selectedEtablissement: EtablissementFeature | null) {
	const codeCommune = selectedEtablissement?.properties.code_commune ?? null;
	const codeDepartement = selectedEtablissement?.properties.code_departement ?? null;
	const codeRegion = selectedEtablissement?.properties.code_region ?? null;

	const { communesGeoJSON } = useCommunesGeoJSON(codeDepartement, !!codeDepartement);
	const { departementsGeoJSON } = useDepartementsGeoJSON(codeRegion, !!codeRegion);
	const { regionsGeoJSON } = useRegionsGeoJSON();

	const commune: CommuneProperties | null =
		communesGeoJSON?.features.find((f) => f.properties.code_commune === codeCommune)
			?.properties ?? null;

	const departement: DepartementProperties | null =
		departementsGeoJSON?.features.find((f) => f.properties.code_departement === codeDepartement)
			?.properties ?? null;

	const region: RegionProperties | null =
		regionsGeoJSON?.features.find((f) => f.properties.code_region === codeRegion)?.properties ??
		null;
=======
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
>>>>>>> 900f4c1 (feat: create hook for data access)

	return { commune, departement, region };
}
