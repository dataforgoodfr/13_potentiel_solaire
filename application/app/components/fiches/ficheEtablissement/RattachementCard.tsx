import Link from 'next/link';

import { EtablissementLite } from '@/app/models/etablissements';
import { CircleAlert } from 'lucide-react';

const RATTACHEMENT_TEXT = "D'autres établissements sont présents dans cette zone :";

interface RattachementCardProps {
	etablissements_rattaches: EtablissementLite[];
}

const RattachementCard: React.FC<RattachementCardProps> = ({ etablissements_rattaches }) => {
	return (
		<div className={'mb-2 flex gap-4 rounded-md bg-slate-400 p-2'}>
			<CircleAlert size={40} />
			<p className='text-sm font-normal text-blue'>{RATTACHEMENT_TEXT}</p>
			{etablissements_rattaches.map((etab) => (
				<li key={etab.identifiant_de_l_etablissement}>
					<Link
						href={`/etablissement/${etab.identifiant_de_l_etablissement}`}
						className='underline decoration-dotted decoration-2 underline-offset-4 transition hover:text-primary'
					>
						{etab.nom_etablissement}
					</Link>
				</li>
			))}
		</div>
	);
};

export default RattachementCard;
