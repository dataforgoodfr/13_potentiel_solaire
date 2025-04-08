const UNKNOWN_TEXTS = {
	nb_eleves: "Nombre d'élèves concernés inconnu",
};

type CollectiviteHeaderCardProps = {
	type: 'commune' | 'departement' | 'region';
	nom: string;
	nbEleves?: number;
	niveau: "d'écoles primaires" | 'de collèges' | 'de lycées';
};

export default function CollectiviteHeaderCard({
	type,
	nom,
	nbEleves,
	niveau,
}: CollectiviteHeaderCardProps) {
	return (
		<div>
			<h1 className='text-xl font-bold'>{nom}</h1>
			<p className='capitalize text-gray-600'>{type}</p>
			<br />
			<p>
				{nbEleves !== undefined ? (
					<>
						<span className='text-xl'>{nbEleves.toLocaleString('fr-FR')}</span> élèves{' '}
						{niveau} concernés
					</>
				) : (
					<span className='italic text-gray-500'>{UNKNOWN_TEXTS.nb_eleves}</span>
				)}
			</p>
		</div>
	);
}
