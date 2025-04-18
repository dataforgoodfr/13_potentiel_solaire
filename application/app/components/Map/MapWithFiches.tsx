'use client';

import { Suspense, useContext, useState } from 'react';

import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
import useEtablissement from '@/app/utils/hooks/useEtablissement';
import {
	InitialViewContext,
	InitialViewContextType,
} from '@/app/utils/providers/initialViewProvider';

import HomeOverlay from '../HomeOverlay/HomeOverlay';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const { isInitialView, closeInitialView } = useContext(
		InitialViewContext,
	) as InitialViewContextType;
	// Temporary fix
	const [selectedEtablissementId, setSelectedEtablissementId] = useState<string | null>(null);
	const { etablissement, isFetching } = useEtablissement(selectedEtablissementId);

	return (
		<div className='flex flex-1 flex-col'>
			<div className='relative flex-1'>
				<Suspense>
					{isInitialView && <HomeOverlay onUseMap={closeInitialView} />}
					<FranceMap
						onSelect={(f) =>
							setSelectedEtablissementId(
								f.properties[EtablissementFeaturePropertiesKeys.Id],
							)
						}
					/>
				</Suspense>
			</div>
			{/* TODO: improve loading */}
			{selectedEtablissementId && etablissement && !isFetching && (
				<Fiches
					etablissement={etablissement}
					onClose={() => setSelectedEtablissementId(null)}
				/>
			)}
		</div>
	);
}
