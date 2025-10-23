import { useMemo } from 'react';

import Link from 'next/link';

import { EtablissementLite } from '@/app/models/etablissements';
import { CircleAlert } from 'lucide-react';

const RATTACHEMENT_TEXT = "D'autres établissements sont présents dans cette zone :";

interface RattachementCardProps {
	etablissements_rattaches: EtablissementLite[];
}

function sortByName(a: EtablissementLite, b: EtablissementLite) {
	return a.nom_etablissement.localeCompare(b.nom_etablissement);
}

const RattachementCard: React.FC<RattachementCardProps> = ({ etablissements_rattaches }) => {
	const sortedEtablissements = useMemo(
		() => [...etablissements_rattaches].sort(sortByName),
		[etablissements_rattaches],
	);
	return (
		<div className={'mb-2 flex gap-4 rounded-md bg-gris p-2'}>
			<CircleAlert size={40} />
			<div className={''}>
				<p className='mb-2 text-sm font-normal text-blue'>{RATTACHEMENT_TEXT}</p>
				<ul className='list-none space-y-4 pl-0 font-bold text-darkgreen'>
					{sortedEtablissements.map((etab) => (
						<li key={etab.identifiant_de_l_etablissement}>
							<Link
								href={`/etablissements/${etab.identifiant_de_l_etablissement}`}
								className='underline decoration-dotted decoration-2 underline-offset-4 transition hover:text-primary'
							>
								{etab.nom_etablissement}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default RattachementCard;
