'use client';

import { Suspense } from 'react';

import useIsFicheOpen from '@/app/utils/hooks/useIsFicheOpen';
import useSelectedPlaces from '@/app/utils/hooks/useSelectedPlaces';

import HomeOverlay from '../HomeOverlay/HomeOverlay';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const { etablissement, commune, departement, region, isFetching } = useSelectedPlaces();
	const [isFicheOpen] = useIsFicheOpen();

	return (
		<main className='flex flex-1 flex-col'>
			<div className='relative flex-1'>
				<Suspense
					fallback={<span className='sr-only'>Chargement de la carte en cours…</span>}
				>
					<HomeOverlay />
					<FranceMap />
				</Suspense>
			</div>
			{isFicheOpen && !isFetching && (
				<Fiches
					commune={commune ?? undefined}
					departement={departement ?? undefined}
					region={region ?? undefined}
					etablissement={etablissement ?? undefined}
				/>
			)}
		</main>
	);
}
