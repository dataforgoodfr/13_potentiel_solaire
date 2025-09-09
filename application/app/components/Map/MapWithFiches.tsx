'use client';

import { Suspense } from 'react';

import useActiveTab from '@/app/utils/hooks/useActiveTab';
import useSelectedPlaces from '@/app/utils/hooks/useSelectedPlaces';

import HomeOverlay from '../HomeOverlay/HomeOverlay';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const { etablissement, commune, departement, region, isFetching } = useSelectedPlaces();
	const [isFicheOpen] = useActiveTab();

	const selectedPlaces = { etablissement, commune, departement, region };

	return (
		<div className='flex flex-1 flex-col'>
			<div className='relative flex-1'>
				<Suspense>
					<HomeOverlay />
					<FranceMap selectedPlaces={selectedPlaces} />
				</Suspense>
			</div>
			{isFicheOpen && (
				<Fiches
					commune={commune}
					departement={departement}
					region={region}
					etablissement={etablissement}
					isFetching={isFetching}
				/>
			)}
		</div>
	);
}
