'use client';

import { Suspense, useState } from 'react';

import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
import useEtablissement from '@/app/utils/hooks/useEtablissement';
import { useInitialView } from '@/app/utils/providers/initialViewProvider';

import useSelectedTerritoires from '../../utils/hooks/useSelectedTerritories';
import HomeOverlay from '../HomeOverlay/HomeOverlay';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const { isInitialView, closeInitialView } = useInitialView();

	const [selectedEtablissementId, setSelectedEtablissementId] = useState<string | null>(null);
	const { etablissement, isFetching } = useEtablissement(selectedEtablissementId);
	const { commune, departement, region } = useSelectedTerritoires(etablissement ?? null);

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
			{selectedEtablissementId && etablissement && !isFetching && (
				<Fiches
					commune={commune ?? undefined}
					departement={departement ?? undefined}
					region={region ?? undefined}
					etablissement={etablissement}
					onClose={() => setSelectedEtablissementId(null)}
				/>
			)}
		</div>
	);
}
