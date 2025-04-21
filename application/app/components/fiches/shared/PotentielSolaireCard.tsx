import { JSX } from 'react';

import { getColorForPotentiel } from '@/app/utils/solar-utils';
import { CircleHelp, HousePlug, Users, Zap } from 'lucide-react';

import { getClosestEnergyUnit, getFormattedPotentielSolaire } from '../../../utils/energy-utils';

const UNKNOWN_TEXTS = {
	potentielSolaire: '—',
	nbEleves: "Nombre d'élèves concernés inconnu",
};

type CarteLevel = 'etablissement' | 'commune' | 'departement' | 'region';

interface PotentielSolaireCardProps {
	potentielSolaire?: number;
	potentielNbFoyers?: number;
	nbEleves?: number;
	level?: CarteLevel;
	header?: React.ReactNode;
}

const getPotentielSolaireElement = (potentiel?: number): JSX.Element => {
	if (!potentiel) return <span className='text-3xl'>—</span>;
	const unit = getClosestEnergyUnit(potentiel);
	return (
		<>
			<span className='text-3xl'>{getFormattedPotentielSolaire(potentiel, unit)}</span>
			<span className='text-base'>&nbsp;{unit}</span>
		</>
	);
};

export default function PotentielSolaireCard({
	potentielSolaire,
	potentielNbFoyers,
	nbEleves,
	level,
	header,
}: PotentielSolaireCardProps) {
	return (
		<div className='mb-4 rounded-2xl border-8 border-solid bg-slate-100 p-2 outline-select'>
			{header && <div className='mb-5'>{header}</div>}

			<div className='flex gap-1 text-grey'>
				<Users />
				{nbEleves !== undefined ? (
					<>
						<p className='font-bold'>
							<span className='text-xl'>{nbEleves.toLocaleString('fr-FR')}</span>{' '}
							élèves concernés
						</p>
					</>
				) : (
					<span className='text-gray-500 italic'>{UNKNOWN_TEXTS.nbEleves}</span>
				)}
			</div>

			<div className='mt-5 flex gap-1 text-grey'>
				<Zap />
				<p className='text-sm font-bold'>Potentiel de production annuelle </p>
			</div>
			<div className='flex items-center gap-2 font-bold text-blue'>
				{potentielSolaire !== undefined && level ? (
					<div
						className='border-1 h-4 w-4 rounded-full border border-slate-400'
						style={{ backgroundColor: getColorForPotentiel(level, potentielSolaire) }}
					/>
				) : (
					<div className='bg-yellow-300 border-1 h-4 w-4 rounded-full border border-slate-400' />
				)}
				{getPotentielSolaireElement(potentielSolaire)}
			</div>

			<br />

			<div className='flex gap-1 text-grey'>
				<HousePlug size={36} />
				<p className='text-sm font-bold'>
					&nbsp;Équivalent à la consommation électrique annuelle de :
				</p>
			</div>
			<div className='flex w-full items-center justify-between ps-7 text-darkgreen'>
				<div className='flex items-center gap-2'>
					<span className='text-3xl font-bold text-darkgreen'>{potentielNbFoyers}</span>
					<div className='flex flex-col text-sm leading-tight'>
						<span className='font-bold'>foyers de</span>
						<span className='font-bold'>2 personnes</span>
					</div>
				</div>
				<CircleHelp />
			</div>
		</div>
	);
}
