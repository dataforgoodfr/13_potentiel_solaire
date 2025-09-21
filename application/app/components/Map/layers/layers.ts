import { TypeEtablissement } from '@/app/models/etablissements';

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
	etablissement: 'Établ.',
	commune: 'Com.',
	departement: 'Dépt.',
	region: 'Rég.',
};

export const TYPE_ETABLISSEMENT_TO_LABEL: Record<TypeEtablissement, string> = {
	Ecole: 'École',
	Collège: 'Collège',
	Lycée: 'Lycée',
};

export const TYPE_ETABLISSEMENT_TO_LABEL_SHORTENED: Record<TypeEtablissement, string> = {
	Ecole: 'ÉCL',
	Collège: 'CLG',
	Lycée: 'LGT',
};
