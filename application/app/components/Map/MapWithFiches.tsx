'use client';

import { useState } from 'react';

import { EtablissementFeature } from '@/app/models/etablissements';

import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementFeature | null>(
		null,
	);

	return (
		<>
			<FranceMap onSelect={setSelectedEtablissement} />
			{selectedEtablissement && (
				<Fiches
					etablissement={{
						...selectedEtablissement.properties,
						longitude: selectedEtablissement.geometry.coordinates[0],
						latitude: selectedEtablissement.geometry.coordinates[1],
					}}
					onClose={() => setSelectedEtablissement(null)}
				/>
			)}
		</>
	);
}
