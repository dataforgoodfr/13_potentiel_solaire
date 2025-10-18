import { NbEtablissementsByNiveauPotentiel } from '@/app/models/common';

type ScolarLevel = 'Écoles' | 'Collèges' | 'Lycées' | 'Établissements';

const UNKNOWN_VALUE_TEXT = '—';

const LABELS = {
	HIGH: 'au potentiel solaire élevé',
	GOOD: 'au potentiel solaire bon',
	LIMITED: 'au potentiel solaire limité',
};

interface RepartitionPotentielSolaireProps {
	niveau?: ScolarLevel;
	repartition: NbEtablissementsByNiveauPotentiel;
}

export default function RepartitionPotentielSolaire({
	niveau,
	repartition = {
		'1_HIGH': 0,
		'2_GOOD': 0,
		'3_LIMITED': 0,
	},
}: RepartitionPotentielSolaireProps) {
	const renderValeur = (valeur?: number) => (valeur !== undefined ? valeur : UNKNOWN_VALUE_TEXT);

	const renderRow = (colorClass: string, label: string, valeur?: number) => (
		<div>
			<div className='flex items-center gap-2 text-sm font-bold text-grey'>
				<div
					className={`border-1 h-4 w-4 shrink-0 rounded-full border border-slate-400 ${colorClass}`}
				/>
				<span>
					{niveau} {label}&nbsp;:
				</span>
			</div>
			<p className='text-center text-base font-bold text-blue'>{renderValeur(valeur)}</p>
		</div>
	);

	return (
		<div className='mb-4'>
			{renderRow('bg-sol_top', LABELS.HIGH, repartition['1_HIGH'])}
			<br />
			{renderRow('bg-sol_ok', LABELS.GOOD, repartition['2_GOOD'])}
			<br />
			{renderRow('bg-sol_ko', LABELS.LIMITED, repartition['3_LIMITED'])}
		</div>
	);
}
