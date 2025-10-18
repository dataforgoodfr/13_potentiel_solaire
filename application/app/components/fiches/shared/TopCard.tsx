import Link from 'next/link';

import { TopEtablissement } from '@/app/models/etablissements';
import { Sun } from 'lucide-react';

const UNKNOWN_TEXTS = {
	TOP_ETABLISSEMENT_EMPTY: 'Aucun établissement mis en avant pour cette collectivité.',
};

const LABELS = {
	TITLE: 'Top 3 potentiel solaire :',
	ARIA_LIST: 'Établissements classés par potentiel solaire décroissant',
	ARIA_RANK_PREFIX: 'Rang',
};

const MEDALS = ['🥇', '🥈', '🥉'];

type Props = {
	topEtablissements: TopEtablissement[] | null;
};

const TopCard = ({ topEtablissements }: Props) => {
	if (!topEtablissements || topEtablissements.length === 0) {
		return <p className='italic text-gray-500'>{UNKNOWN_TEXTS.TOP_ETABLISSEMENT_EMPTY}</p>;
	}

	return (
		<div>
			<div className='flex gap-1 text-grey'>
				<Sun aria-hidden='true' focusable='false' />
				<p>{LABELS.TITLE}</p>
			</div>
			<ul
				className='list-none space-y-1 pl-0 font-bold text-darkgreen'
				aria-label={LABELS.ARIA_LIST}
			>
				{topEtablissements.slice(0, 3).map((etab, index) => (
					<li key={etab.id}>
						<span aria-label={`${LABELS.ARIA_RANK_PREFIX} ${index + 1}`} role='img'>
							{MEDALS[index]}{' '}
						</span>
						<Link
							href={`/etablissements/${etab.id}`}
							className='underline decoration-dotted decoration-2 underline-offset-4 transition hover:text-primary'
						>
							{etab.libelle}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TopCard;
