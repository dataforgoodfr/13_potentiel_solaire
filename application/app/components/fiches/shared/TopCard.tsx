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
				<Sun />
				<p>Top 3 potentiel solaire :</p>
			</div>
			<ul className='list-none space-y-1 pl-0 font-bold text-darkgreen'>
				{topEtablissements.slice(0, 3).map((etab, index) => (
					<li key={etab.id}>
						{medals[index]}{' '}
						<Link
							href={`/etablissement/${etab.id}`}
							target='_blank'
							rel='noopener noreferrer'
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
