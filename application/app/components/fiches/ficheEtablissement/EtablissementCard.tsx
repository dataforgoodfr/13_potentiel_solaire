import { Etablissement } from '@/app/models/etablissements';

import { TYPE_ETABLISSEMENT_TO_LABEL } from '../../Map/layers/layers';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'type_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3'
>;

const UNKNOWN_TEXTS = {
	NAME: "Nom de l'établissement inconnu",
	ADRESSE: 'Adresse inconnue',
};

const LABELS = {
	ARIA_HEADER_PREFIX: 'Fiche de',
	ARIA_LABEL: 'fiche-etablissement',
};

const EtablissementCard = ({
	nom_etablissement,
	type_etablissement,
	adresse_1,
	adresse_2,
	adresse_3,
}: EtablissementCardProps) => {
	const nomEtablissement = nom_etablissement || UNKNOWN_TEXTS.NAME;
	const typeEtablissement = TYPE_ETABLISSEMENT_TO_LABEL[type_etablissement];
	return (
		<header className='text-blue' aria-labelledby={LABELS.ARIA_LABEL}>
			<h2
				className='text-2xl font-bold'
				aria-label={`${LABELS.ARIA_HEADER_PREFIX} ${nomEtablissement}, ${typeEtablissement}`}
				id={LABELS.ARIA_LABEL}
			>
				{nomEtablissement}
			</h2>
			<p>{adresse_1 || UNKNOWN_TEXTS.ADRESSE}</p>
			{adresse_2 && <p>{adresse_2}</p>}
			{adresse_3 && <p>{adresse_3}</p>}
		</header>
	);
};

export default EtablissementCard;
