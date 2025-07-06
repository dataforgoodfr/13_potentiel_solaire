import React from 'react';

import { University } from 'lucide-react';

const UNKNOWN_TEXTS = {
	nbEtablissements: '—',
};

function getNiveauLabel(niveau?: EtablissementNiveau): string {
	if (!niveau) return '-';
	switch (niveau) {
		case 'primaire':
			return "d'écoles primaires";
		case 'college':
			return 'de collèges';
		case 'lycee':
			return 'de lycées';
		case 'etablissements':
			return "d'établissements";
		default:
			throw new Error(`Niveau inconnu : ${niveau}`);
	}
}

type EtablissementNiveau = 'lycee' | 'college' | 'primaire' | 'etablissements';

interface NbEtablissementsProps {
	niveau: EtablissementNiveau;
	nbEtablissements: number;
}

const NbEtablissements: React.FC<NbEtablissementsProps> = ({ niveau, nbEtablissements }) => {
	return (
		<>
			<dl className='text-grey'>
				<dt className='flex items-center gap-1 text-sm font-bold'>
					<University aria-hidden='true' />
					Nombre total {getNiveauLabel(niveau)} :
				</dt>
				<dd className='pl-6 text-3xl font-bold'>
					{nbEtablissements !== undefined && nbEtablissements !== null
						? nbEtablissements
						: UNKNOWN_TEXTS.nbEtablissements}
				</dd>
			</dl>
		</>
	);
};

export default NbEtablissements;
