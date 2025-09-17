import { Commune } from '@/app/models/communes';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';
import { getLevelName } from '@/app/utils/level-utils';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

import { Level } from './interfaces';
import { LEVEL_TO_LABEL } from './layers/layers';

type CurrentLevelProps = {
	level: Exclude<Level, 'nation'>;
	levelItem: Region | Departement | Commune | Etablissement;
	openFiche: (level: Exclude<Level, 'nation'>) => void;
};

export default function CurrentLevel({ level, levelItem, openFiche }: CurrentLevelProps) {
	const nom = getLevelName(level, levelItem);
	return (
		<Button
			onClick={() => openFiche(level)}
			className='flex min-w-0 items-center gap-2 rounded-md bg-green text-sm font-bold text-darkgreen shadow-md hover:bg-green hover:underline'
			size='sm'
			aria-label={`Ouvrir la fiche de ${nom} (${LEVEL_TO_LABEL[level]})`}
		>
			<span className='min-w-0 truncate'>
				{nom} {`(${LEVEL_TO_LABEL[level]})`}
			</span>
			<MapPin size={20} />
		</Button>
	);
}
