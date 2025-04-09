import { Sun } from 'lucide-react';
import { Etablissement } from '@/app/models/etablissements';

const UNKNOWN_TEXTS = {
	top_etablissement: 'Aucun établissement mis en avant pour cette collectivité.',
};


type Props = {
  topEtablissements: Etablissement[] | null;
  setSelectedEtablissement: (etablissement: Etablissement) => void;
};

const TopCard = ({ topEtablissements, setSelectedEtablissement }: Props) => {
	const medals = ['🥇', '🥈', '🥉'];

	if (!topEtablissements || topEtablissements.length === 0) {
		return (
			<p className='italic text-gray-500'>
        {UNKNOWN_TEXTS.top_etablissement}
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
					<li key={etab.identifiant_de_l_etablissement}>
						{medals[index] ?? '🏅'}{' '}
						<button
							onClick={() => setSelectedEtablissement(etab)}
							className='text-start transition hover:text-primary'
						>
							{etab.nom_etablissement}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TopCard;
