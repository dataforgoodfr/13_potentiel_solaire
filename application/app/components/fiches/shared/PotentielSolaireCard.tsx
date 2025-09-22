import { JSX } from 'react';

import { getColorForPotentiel } from '@/app/utils/solar-utils';
import * as Popover from '@radix-ui/react-popover';
import { CircleHelp, FileX, HousePlug, Users, Zap } from 'lucide-react';

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
	grise?: boolean;
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

const potentielEquivalentHelpText = '5000 kWh/an pour un foyer de 2 personnes';

export default function PotentielSolaireCard({
	potentielSolaire,
	potentielNbFoyers,
	nbEleves,
	level,
	header,
	grise,
}: PotentielSolaireCardProps) {
	if (grise) {
		return (
			<div className='mb-4 rounded-2xl border-8 border-solid bg-slate-100 p-6 outline-select'>
				<div className='flex items-center text-grey'>
					<FileX className='mt-2 h-8 w-8 flex-shrink-0 self-stretch' />
					<p className='ml-2 text-base font-semibold'>
						Données incomplètes pour cet établissement
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className='mb-4 rounded-2xl border-8 border-solid bg-slate-100 p-2 outline-select'>
			{header && <div className='mb-5'>{header}</div>}

			<div className='flex gap-1 text-grey'>
				<Users aria-hidden='true' focusable='false' />
				{nbEleves !== undefined ? (
					<>
						<p className='font-bold'>
							<span className='text-base'>{nbEleves.toLocaleString('fr-FR')}</span>{' '}
							élèves concernés
						</p>
					</>
				) : (
					<span className='text-gray-500 italic'>{UNKNOWN_TEXTS.nbEleves}</span>
				)}
			</div>

			<div className='mt-5 flex gap-1 text-grey'>
				<Zap aria-hidden='true' focusable='false' />
				<p className='text-sm font-bold'>Potentiel de production annuelle&nbsp;:</p>
			</div>
			<div className='flex items-center gap-2 font-bold text-blue'>
				{potentielSolaire !== undefined && level ? (
					<div
						className='border-1 print-bg h-4 w-4 rounded-full border border-slate-400'
						style={{ backgroundColor: getColorForPotentiel(level, potentielSolaire) }}
					/>
				) : (
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400' />
				)}
				{getPotentielSolaireElement(potentielSolaire)}
			</div>

			<br />

			<div className='flex gap-1 text-grey'>
				<HousePlug size={36} aria-hidden='true' focusable='false' />
				<p className='text-sm font-bold'>
					&nbsp;Équivalent à la consommation électrique annuelle de&nbsp;:
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
				<Popover.Root>
					<Popover.Trigger asChild>
						<button
							aria-label="Informations sur l'équivalent de consommation"
							className='hover:bg-gray-100 rounded p-2 text-darkgreen transition print:hidden'
						>
							<CircleHelp aria-hidden='true' focusable='false' />
						</button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content
							className='z-tooltip rounded bg-blue px-3 py-1.5 text-xs text-white shadow'
							sideOffset={5}
						>
							{potentielEquivalentHelpText}
							<Popover.Arrow className='fill-black' />
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
			</div>
			<div className='ms-9 hidden italic print:block'>({potentielEquivalentHelpText})</div>
		</div>
	);
}
