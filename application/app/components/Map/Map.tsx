'use client';

import { useState } from 'react';

import FranceMap from './FranceMap';
import Legend from './Legend/Legend';
import { COLOR_THRESHOLDS } from './constants';
import { Level } from './interfaces';

export default function Map() {
	const [level, setLevel] = useState<Level>('regions');

	return (
		<div className='relative h-full w-full'>
			<FranceMap onLevelChange={setLevel} />
			<div className='absolute bottom-2 left-2'>
				<Legend thresholds={COLOR_THRESHOLDS[level]} />
			</div>
		</div>
	);
}
