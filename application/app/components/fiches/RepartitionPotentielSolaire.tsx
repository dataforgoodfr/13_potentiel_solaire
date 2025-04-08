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
	const renderValeur = (valeur?: number) => (valeur !== undefined ? valeur : 'ND');

	return (
		<div className='mb-4'>
			<p>🟠 {niveau} potentiel solaire élevé :</p>
			<p className='text-center text-xl font-bold'>{renderValeur(repartition.eleve)}</p>
			<br />
			<p>🟡 {niveau} potentiel solaire bon :</p>
			<p className='text-center text-xl font-bold'>{renderValeur(repartition.bon)}</p>
			<br />
			<p>⚪️ {niveau} potentiel solaire bas :</p>
			<p className='text-center text-xl font-bold'>{renderValeur(repartition.bas)}</p>
		</div>
	);
}
