'use client';

import { useState } from 'react';

import { EtablissementFeature } from '@/app/models/etablissements';

import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';
import Legend from './Legend/Legend';
import { COLOR_THRESHOLDS } from './constants';
import { Level } from './interfaces';

export default function MapWithFiches() {
	const [level, setLevel] = useState<Level>('regions');
	const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementFeature | null>(
		null,
	);

	return (
		<div className='relative h-full w-full'>
			<FranceMap onSelect={setSelectedEtablissement} onLevelChange={setLevel} />
			<div className='absolute bottom-2 left-2'>
				<Legend thresholds={COLOR_THRESHOLDS[level]} />
			</div>
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
		</div>
	);
}
