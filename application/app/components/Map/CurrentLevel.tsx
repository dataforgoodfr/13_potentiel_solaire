import { Commune } from '@/app/models/communes';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';
import { getLevelName } from '@/app/utils/level-utils';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

import { Level } from './interfaces';

const LEVEL_TO_LABEL: Record<Exclude<Level, 'nation'>, string> = {
	etablissement: 'Établissement',
	commune: 'Commune',
	departement: 'Département',
	region: 'Région',
};

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
			className='flex items-center gap-2 rounded-md border border-white bg-blue text-sm shadow-md'
			size='sm'
			aria-label={`Ouvrir la fiche de ${nom} (${LEVEL_TO_LABEL[level]})`}
		>
			{nom} {`(${LEVEL_TO_LABEL[level]})`}
			<MapPin size={20} />
		</Button>
	);
}
