'use client';

import { useState } from 'react';

import FranceMap from './FranceMap';
import Legend from './Legend/Legend';
import { COLOR_THRESHOLDS } from './constants';
import { Level } from './interfaces';

function getThresholdsByLevel(level: Level) {
	if (level === 'communes') return COLOR_THRESHOLDS.communes;
	if (level === 'departements') return COLOR_THRESHOLDS.departements;

	return COLOR_THRESHOLDS.regions;
}

export default function Map() {
	const [level, setLevel] = useState<Level>('regions');

	return (
		<div className='relative h-full w-full'>
			<FranceMap onLevelChange={setLevel} />
			<div className='absolute bottom-2 left-2'>
				<Legend thresholds={getThresholdsByLevel(level)} />
			</div>
		</div>
	);
}
