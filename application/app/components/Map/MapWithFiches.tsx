'use client';

import { useState } from 'react';

import { EtablissementFeature } from '@/app/models/etablissements';

import useSelectedTerritoires from '../../utils/hooks/useSelectedTerritories';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementFeature | null>(
		null,
	);

	const { commune, departement, region } = useSelectedTerritoires(selectedEtablissement);

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex-1'>
				<FranceMap onSelect={setSelectedEtablissement} />
			</div>
			{selectedEtablissement && (
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
				/>
			)}
		</div>
	);
}
