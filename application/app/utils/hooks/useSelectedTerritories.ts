'use client';

import { CommuneProperties } from '@/app/models/communes';
import { DepartementProperties } from '@/app/models/departements';
import { EtablissementFeature } from '@/app/models/etablissements';
import { RegionProperties } from '@/app/models/regions';
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

	return { commune, departement, region };
}
