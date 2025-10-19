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
			<div className='flex gap-1 text-grey'>
				<University aria-hidden='true' focusable='false' />
				<p className='text-sm font-bold'>Nombre total {getNiveauLabel(niveau)}&nbsp;:</p>
			</div>
			<p className='font-bold text-grey'>
				<span className='ps-7 text-3xl'>
					{nbEtablissements !== undefined && nbEtablissements !== null
						? nbEtablissements
						: UNKNOWN_TEXTS.nbEtablissements}
				</span>
			</p>
		</>
	);
};

export default NbEtablissements;
