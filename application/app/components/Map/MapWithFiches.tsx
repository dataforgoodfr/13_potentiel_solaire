'use client';

import { Suspense, useState } from 'react';

import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
import useEtablissement from '@/app/utils/hooks/useEtablissement';

import useSelectedTerritoires from '../../utils/hooks/useSelectedTerritories';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementFeature | null>(
		null,
	);
	const { commune, departement, region } = useSelectedTerritoires(selectedEtablissement);
	// Temporary fix
	const [selectedEtablissementId, setSelectedEtablissementId] = useState<string | null>(null);
	const { etablissement, isFetching } = useEtablissement(selectedEtablissementId);

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
			{/* TODO: improve loading */}
			{selectedEtablissementId && etablissement && !isFetching && (
				<Fiches
					etablissement={{
						...selectedEtablissement.properties,
						longitude: selectedEtablissement.geometry.coordinates[0],
						latitude: selectedEtablissement.geometry.coordinates[1],
					}}
					commune={commune ?? undefined}
					departement={departement ?? undefined}
					region={region ?? undefined}
					onClose={() => setSelectedEtablissement(null)}
					etablissement={etablissement}
					onClose={() => setSelectedEtablissementId(null)}
				/>
			)}
		</div>
	);
}
