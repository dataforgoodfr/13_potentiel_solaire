import { CircleHelp, HousePlug, University, Users, Zap } from 'lucide-react';

import {
	getFormattedFoyersEquivalents,
	getFormattedPotentielSolaire,
} from '../../../utils/energy-utils';
import { getColorForPotentiel, getPotentielCategory } from '../../../utils/solar-utils';

const UNKNOWN_TEXTS = {
	potentielSolaire: '—',
	nbEtablissements: '—',
	nbEleves: "Nombre d'élèves concernés inconnu",
};

const SOLAR_TEXT = {
	top: 'Le potentiel solaire de cet établissement me paraît tout-à-fait rayonnant !',
	ok: 'Le potentiel solaire de cet établissement me paraît plutôt satisfaisant !',
	ko: 'Le potentiel solaire de cet établissement me paraît un peu limité, mais pas impossible pour autant !',
};

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

export default function PotentielSolaireCard({
	potentielSolaire,
	nbEtablissements,
	niveau,
	nbEleves,
	showInterpretation = false,
	showNbEtablissements = true,
	level,
}: PotentielSolaireCardProps) {
	return (
		<div className='mb-4 rounded-2xl border-8 border-solid bg-slate-100 p-2 outline-select'>
			{showInterpretation && potentielSolaire !== undefined && level && (
				<>
					{(() => {
						const category = getPotentielCategory(level, potentielSolaire);
						const bgColor =
							category === 'top'
								? 'bg-sol_top'
								: category === 'ok'
									? 'bg-green'
									: 'bg-sol_ko';

						return (
							<div className={`rounded-xl p-5 ${bgColor}`}>
								<p className='font-normal'>{SOLAR_TEXT[category]}</p>
							</div>
						);
					})()}
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
