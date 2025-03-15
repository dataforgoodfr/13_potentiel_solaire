'use client';

import useCommunesGeoJSON from '@/app/utils/hooks/useCommunesGeoJSON';
import useEtablissementsGeoJSON from '@/app/utils/hooks/useEtablissementsGeoJSON';

import Loading from '../Loading';
import { Map } from './Map';

export default function MapWithLoader() {
	const communesQuery = useCommunesGeoJSON();
	const etablissementsQuery = useEtablissementsGeoJSON();

	if (communesQuery === undefined || etablissementsQuery === undefined) {
		return <Loading />;
	}

	const { data: communesGeoJSON, error: communesError } = communesQuery;
	const { data: etablissementsGeoJSON, error: etablissementsError } = etablissementsQuery;

	if (communesError || etablissementsError || !communesGeoJSON || !etablissementsGeoJSON) {
		return 'Erreur lors du chargement des données de la carte.';
	}

	return <Map etablissements={etablissementsGeoJSON} communes={communesGeoJSON} />;
}
