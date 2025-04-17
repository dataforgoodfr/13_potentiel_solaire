type ScolarLevel = 'ecoles' | 'colleges' | 'lycee';

interface RepartitionPotentielSolaireProps {
	niveau?: ScolarLevel;
	repartition: {
		eleve?: number;
		bon?: number;
		bas?: number;
	};
}

export default function RepartitionPotentielSolaire({
	niveau,
	repartition,
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
					{renderValeur(repartition.eleve)}
				</p>
			</div>
			<br />
			<div>
				<div className='flex items-center gap-2 text-sm font-bold text-grey'>
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400 bg-sol_ok' />
					<span>{niveau} au potentiel solaire bon</span>
				</div>
				<p className='text-center text-xl font-bold text-blue'>
					{renderValeur(repartition.bon)}
				</p>
			</div>

			<br />
			<div>
				<div className='flex items-center gap-2 text-sm font-bold text-grey'>
					<div className='border-1 h-4 w-4 rounded-full border border-slate-400 bg-sol_ko' />
					<span>{niveau} au potentiel solaire bas</span>
				</div>
				<p className='text-center text-xl font-bold text-blue'>
					{renderValeur(repartition.bas)}
				</p>
			</div>
		</div>
	);
}
