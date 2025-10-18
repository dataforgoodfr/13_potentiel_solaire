'use client';

import { Suspense } from 'react';

import useActiveTab from '@/app/utils/hooks/useActiveTab';
import useSelectedPlaces from '@/app/utils/hooks/useSelectedPlaces';
import { useInitialView } from '@/app/utils/providers/initialViewProvider';

import HomeOverlay from '../HomeOverlay/HomeOverlay';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const { etablissement, commune, departement, region, contactMairie, isFetching } =
		useSelectedPlaces();
	const [isFicheOpen] = useActiveTab();
	const { isInitialView } = useInitialView();

	const selectedPlaces = { etablissement, commune, departement, region };

	return (
		<div className='relative flex-1 overflow-x-hidden pb-safe-bottom'>
			{!isInitialView && (
				<h1 className='sr-only'>Découvrez le potentiel solaire de votre école</h1>
			)}
			<Suspense>
				<HomeOverlay />
				<FranceMap selectedPlaces={selectedPlaces} hideToolbar={isInitialView} />
			</Suspense>
			{isFicheOpen && (
				<Fiches
					commune={commune}
					departement={departement}
					region={region}
					etablissement={etablissement}
					contactMairie={contactMairie}
					isFetching={isFetching}
				/>
			)}
		</div>
	);
}
