import Link from 'next/link';

import { TopEtablissement } from '@/app/models/etablissements';
import { Sun } from 'lucide-react';

const UNKNOWN_TEXTS = {
	top_etablissement: 'Aucun établissement mis en avant pour cette collectivité.',
};

const medals = ['🥇', '🥈', '🥉'];

type Props = {
	topEtablissements: TopEtablissement[] | null;
};

const TopCard = ({ topEtablissements }: Props) => {
	if (!topEtablissements || topEtablissements.length === 0) {
		return <p className='text-gray-500 italic'>{UNKNOWN_TEXTS.top_etablissement}</p>;
	}

	return (
		<div>
			<div className='flex gap-1 text-grey'>
				<Sun aria-hidden="true" focusable="false"/>
				<p>Top 3 potentiel solaire :</p>
			</div>
			<ul className='list-none space-y-1 pl-0 font-bold text-darkgreen' aria-label='Établissements classés par potentiel solaire décroissant'>
				{topEtablissements.slice(0, 3).map((etab, index) => (
					<li key={etab.id}>
            <span aria-label={`Rang ${index + 1}`} role='img'>
						  {medals[index]}{' '}
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
