import { Etablissement } from '@/app/models/etablissements';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3'
>;

const UNKNOWN_TEXTS = {
	name: "Nom de l'établissement inconnu",
	adresse: 'Adresse inconnue',
};

const EtablissementCard = ({
	nom_etablissement,
	adresse_1,
	adresse_2,
	adresse_3,
}: EtablissementCardProps) => {
	return (
		<article className='text-blue'>
			<h1 className='text-2xl font-bold'>{nom_etablissement || UNKNOWN_TEXTS.name}</h1>
			<address className='not-italic'>
				<p>{adresse_1 || UNKNOWN_TEXTS.adresse}</p>
				{adresse_2 && <p>{adresse_2}</p>}
				{adresse_3 && <p>{adresse_3}</p>}
			</address>
		</article>
	);
};

export default EtablissementCard;
