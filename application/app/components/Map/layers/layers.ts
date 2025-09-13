import { Level } from '../interfaces';

export const LEVEL_TO_LABEL: Record<Exclude<Level, 'nation'>, string> = {
	etablissement: 'Établissement',
	commune: 'Commune',
	departement: 'Département',
	region: 'Région',
};

export const LEVEL_TO_LABEL_INCLUDING_NATION: Record<Level, string> = {
	...LEVEL_TO_LABEL,
	nation: 'Pays',
};

export const LEVEL_TO_LABEL_SHORTENED: Record<Exclude<Level, 'nation'>, string> = {
	etablissement: 'Établissement',
	commune: 'Commune',
	departement: 'Dépt.',
	region: 'Région',
};
