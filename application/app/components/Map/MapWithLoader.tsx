'use client';

import useCommunesGeoJSON from '@/app/utils/hooks/useCommunesGeoJSON';
import useEtablissementsGeoJSON from '@/app/utils/hooks/useEtablissementsGeoJSON';

import Error from '../Error';
import Loading from '../Loading';
import Map from './Map';

export default function MapWithLoader() {
	const {
		communesGeoJSON,
		isError: communesError,
		isLoading: isCommunesLoading,
	} = useCommunesGeoJSON();
	const {
		etablissementsGeoJSON,
		isError: etablissementsError,
		isLoading: isEtablissementsLoading,
	} = useEtablissementsGeoJSON();

	if (isCommunesLoading || isEtablissementsLoading) {
		return <Loading />;
	}

	if (communesError || etablissementsError || !communesGeoJSON || !etablissementsGeoJSON) {
		return <Error />;
	}

	return <Map etablissements={etablissementsGeoJSON} communes={communesGeoJSON} />;
}
