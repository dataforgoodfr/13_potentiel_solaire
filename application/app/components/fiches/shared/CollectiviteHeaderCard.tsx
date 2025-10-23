import { LEVEL_TO_LABEL } from '../../Map/layers/layers';

const LABELS = {
	ARIA_HEADER_PREFIX: 'Fiche de',
};

type CollectiviteHeaderCardProps = {
	type: 'commune' | 'departement' | 'region';
	nom: string;
};

export default function CollectiviteHeaderCard({ type, nom }: CollectiviteHeaderCardProps) {
	const typeLabel = LEVEL_TO_LABEL[type];
	return (
		<header aria-labelledby='fiche-collectivite'>
			<h2
				className='text-2xl font-bold text-blue'
				aria-label={`${LABELS.ARIA_HEADER_PREFIX} ${nom}, ${typeLabel}`}
				id='fiche-collectivite'
			>
				{nom}
			</h2>
			<p className='capitalize text-grey'>{typeLabel}</p>
			<br className='print:hidden' />
		</header>
	);
}
