import { Etablissement } from '@/app/models/etablissements';

import { TYPE_ETABLISSEMENT_TO_LABEL } from '../../Map/layers/layers';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'type_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3'
>;

const UNKNOWN_TEXTS = {
	name: "Nom de l'établissement inconnu",
	adresse: 'Adresse inconnue',
};

const EtablissementCard = ({
	nom_etablissement,
	type_etablissement,
	adresse_1,
	adresse_2,
	adresse_3,
}: EtablissementCardProps) => {
	const nomEtablissement = nom_etablissement || UNKNOWN_TEXTS.name;
	const typeEtablissement = TYPE_ETABLISSEMENT_TO_LABEL[type_etablissement];
	return (
		<header className='text-blue' aria-labelledby='fiche-etablissement'>
			<h2
				className='text-2xl font-bold'
				aria-label={`Fiche de ${nomEtablissement}, ${typeEtablissement}`}
				id='fiche-etablissement'
			>
				{nomEtablissement}
			</h2>
			<p>{adresse_1 || UNKNOWN_TEXTS.adresse}</p>
			{adresse_2 && <p>{adresse_2}</p>}
			{adresse_3 && <p>{adresse_3}</p>}
		</header>
	);
};

export default EtablissementCard;
