'use client';

import { useState } from 'react';

import { EtablissementFeaturePropertiesKeys } from '@/app/models/etablissements';
import useEtablissement from '@/app/utils/hooks/useEtablissement';

import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	// Temporary fix
	const [selectedEtablissementId, setSelectedEtablissementId] = useState<string | null>(null);
	const { etablissement, isFetching } = useEtablissement(selectedEtablissementId);

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex-1'>
				<FranceMap
					onSelect={(f) =>
						setSelectedEtablissementId(
							f.properties[EtablissementFeaturePropertiesKeys.Id],
						)
					}
				/>
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
