import React from 'react';

import { University } from 'lucide-react';

const UNKNOWN_TEXTS = {
	NB_ETABLISSEMENTS: '—',
};

const LABELS = {
	TITLE_PREFIX: 'Nombre total',
	NIVEAU_PRIMAIRE: "d'écoles primaires",
	NIVEAU_COLLEGE: 'de collèges',
	NIVEAU_LYCEE: 'de lycées',
	NIVEAU_ETABLISSEMENTS: "d'établissements",
	NIVEAU_UNKNOWN: 'Niveau inconnu :',
};

function getNiveauLabel(niveau?: EtablissementNiveau): string {
	if (!niveau) return '-';
	switch (niveau) {
		case 'primaire':
			return LABELS.NIVEAU_PRIMAIRE;
		case 'college':
			return LABELS.NIVEAU_COLLEGE;
		case 'lycee':
			return LABELS.NIVEAU_LYCEE;
		case 'etablissements':
			return LABELS.NIVEAU_ETABLISSEMENTS;
		default:
			throw new Error(`${LABELS.NIVEAU_UNKNOWN} ${niveau}`);
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
				<p className='text-sm font-bold'>
					{LABELS.TITLE_PREFIX} {getNiveauLabel(niveau)}&nbsp;:
				</p>
			</div>
			<p className='font-bold text-grey'>
				<span className='ps-7 text-3xl'>
					{nbEtablissements !== undefined && nbEtablissements !== null
						? nbEtablissements
						: UNKNOWN_TEXTS.NB_ETABLISSEMENTS}
				</span>
			</p>
		</>
	);
};

export default NbEtablissements;
