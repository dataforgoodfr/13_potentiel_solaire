import Link from 'next/link';

import { Sun } from 'lucide-react';

type Etablissement = {
	id: string;
	libelle: string;
	potentiel_solaire: number;
};

type Props = {
	topEtablissements: Etablissement[] | null;
};

const TopPrimairesCard = ({ topEtablissements }: Props) => {
	const medals = ['🥇', '🥈', '🥉'];

	if (!topEtablissements || topEtablissements.length === 0) {
		return (
			<p className='italic text-gray-500'>
				Aucun établissement mis en avant pour cette commune.
			</p>
		);
	}

	return (
		<div>
			<div className='flex gap-1'>
				<Sun />
				<p>Top 3 potentiel solaire :</p>
			</div>
			<ul className='list-none space-y-1 pl-0 font-bold text-darkgreen'>
				{topEtablissements.slice(0, 3).map((etab, index) => (
					<li key={etab.id}>
						{medals[index] ?? '🏅'}{' '}
						<Link
							href={`/etablissement/${etab.id}`}
							className='underline transition hover:text-primary'
						>
							{etab.libelle}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TopPrimairesCard;
