interface RepartitionPotentielSolaireProps {
	niveau: 'Écoles' | 'Collèges' | 'Lycées';
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
			<p className='text-sm font-bold text-grey'>🟠 {niveau} au potentiel solaire élevé :</p>
			<p className='text-center text-xl font-bold text-blue'>
				{renderValeur(repartition.eleve)}
			</p>
			<br />
			<p className='text-sm font-bold text-grey'>🟡 {niveau} au potentiel solaire bon :</p>
			<p className='text-center text-xl font-bold text-blue'>
				{renderValeur(repartition.bon)}
			</p>
			<br />
			<p className='text-sm font-bold text-grey'>⚪️ {niveau} au potentiel solaire bas :</p>
			<p className='text-center text-xl font-bold text-blue'>
				{renderValeur(repartition.bas)}
			</p>
		</div>
	);
}
