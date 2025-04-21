import { NbEtablissementsByNiveauPotentiel } from '@/app/models/common';

type ScolarLevel = 'Écoles' | 'Collèges' | 'Lycées' | 'Établissements';

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
	const renderValeur = (valeur?: number) => (valeur !== undefined ? valeur : '—');

	return (
		<div className='mb-4'>
			<div>
				<div className='flex items-center gap-2 text-sm font-bold text-grey'>
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400 bg-sol_top' />
					<span>{niveau} au potentiel solaire élevé</span>
				</div>
				<p className='text-center text-xl font-bold text-blue'>
					{renderValeur(repartition['1_HIGH'])}
				</p>
			</div>
			<br />
			<div>
				<div className='flex items-center gap-2 text-sm font-bold text-grey'>
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400 bg-sol_ok' />
					<span>{niveau} au potentiel solaire bon</span>
				</div>
				<p className='text-center text-xl font-bold text-blue'>
					{renderValeur(repartition['2_GOOD'])}
				</p>
			</div>

			<br />
			<div>
				<div className='flex items-center gap-2 text-sm font-bold text-grey'>
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400 bg-sol_ko' />
					<span>{niveau} au potentiel solaire bas</span>
				</div>
				<p className='text-center text-xl font-bold text-blue'>
					{renderValeur(repartition['3_LIMITED'])}
				</p>
			</div>
		</div>
	);
}
