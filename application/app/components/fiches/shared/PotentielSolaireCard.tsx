import { CircleHelp, HousePlug, University, Users, Zap } from 'lucide-react';

import {
	getFormattedFoyersEquivalents,
	getFormattedPotentielSolaire,
} from '../../../utils/energy-utils';
import { COLOR_THRESHOLDS } from '../../Map/constants';

const UNKNOWN_TEXTS = {
	potentielSolaire: '—',
	nbEtablissements: '—',
	nbEleves: "Nombre d'élèves concernés inconnu",
};

const SOLAR_TEXT = {
	high: 'Le potentiel solaire de cet établissement me paraît tout à fait rayonnant',
	low: 'Des optimisations sont à prévoir pour un bon potentiel solaire',
};

const HIGH_SOLAR_THRESHOLD = 500_000;

type EtablissementNiveau = 'lycee' | 'college' | 'primaire' | 'etablissements';
type CarteLevel = 'etablissements' | 'communes' | 'departements' | 'regions';

function getNiveauLabel(niveau?: EtablissementNiveau): string {
	if (!niveau) return '-';
	switch (niveau) {
		case 'primaire':
			return "d'écoles primaires";
		case 'college':
			return 'de collèges';
		case 'lycee':
			return 'de lycées';
		case 'etablissements':
			return "d'établissements";
		default:
			throw new Error(`Niveau inconnu : ${niveau}`);
	}
}

interface PotentielSolaireCardProps {
	potentielSolaire?: number;
	nbEtablissements?: number;
	niveau?: EtablissementNiveau;
	nbEleves?: number;
	showInterpretation?: boolean;
	showNbEtablissements?: boolean;
	level?: CarteLevel;
}

function getColorForPotentiel(level: keyof typeof COLOR_THRESHOLDS, potentiel: number): string {
	const thresholds = COLOR_THRESHOLDS[level];
	const entries = Object.entries(thresholds)
		.map(([threshold, color]) => [Number(threshold), color] as [number, string])
		.sort((a, b) => a[0] - b[0]);

	let lastColor = entries[0][1];

	for (const [threshold, color] of entries) {
		if (potentiel >= threshold) {
			lastColor = color;
		} else {
			break;
		}
	}

	return lastColor;
}

export default function PotentielSolaireCard({
	potentielSolaire,
	nbEtablissements,
	niveau,
	nbEleves,
	showInterpretation = false,
	showNbEtablissements = true,
	level,
}: PotentielSolaireCardProps) {
	const isHigh = (potentielSolaire ?? 0) > HIGH_SOLAR_THRESHOLD;

	return (
		<div className='mb-4 rounded-2xl border-8 border-solid bg-slate-100 p-2 outline-select'>
			{showInterpretation && (
				<>
					<div
						className={isHigh ? 'rounded-xl bg-green p-5' : 'rounded-xl bg-yellow p-5'}
					>
						<p className='font-normal'>{isHigh ? SOLAR_TEXT.high : SOLAR_TEXT.low}</p>
					</div>
					<br />
				</>
			)}

			{showNbEtablissements && (
				<>
					<div className='flex gap-1 text-grey'>
						<University />
						<p className='text-sm font-bold'>Nombre total {getNiveauLabel(niveau)} :</p>
					</div>
					<p className='font-bold text-grey'>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<span className='text-3xl'>
							{nbEtablissements !== undefined && nbEtablissements !== null
								? nbEtablissements
								: UNKNOWN_TEXTS.nbEtablissements}
						</span>
					</p>
					<br />
				</>
			)}

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
				<span className='text-3xl'>{getFormattedPotentielSolaire(potentielSolaire)}</span>
				<span className='text-base'>&nbsp;MWh/an</span>
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
					<span className='text-3xl font-bold text-darkgreen'>
						{getFormattedFoyersEquivalents(potentielSolaire)}
					</span>
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
