'use client';

import { Suspense, useState } from 'react';

import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
import useEtablissement from '@/app/utils/hooks/useEtablissement';

import useSelectedTerritoires from '../../utils/hooks/useSelectedTerritories';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const [selectedEtablissementId, setSelectedEtablissementId] = useState<string | null>(null);
	const { etablissement, isFetching } = useEtablissement(selectedEtablissementId);
  const { commune, departement, region } = useSelectedTerritoires(etablissement ?? null);

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex-1'>
				<Suspense>
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
