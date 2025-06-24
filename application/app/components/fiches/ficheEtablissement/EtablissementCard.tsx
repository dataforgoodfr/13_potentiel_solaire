import { Etablissement } from '@/app/models/etablissements';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3' | 'code_postal' | 'nom_commune'
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
	code_postal,
	nom_commune,
}: EtablissementCardProps) => {
	return (
		<article className='text-blue'>
			<h1 className='text-2xl font-bold'>{nom_etablissement || UNKNOWN_TEXTS.name}</h1>
			<address className='not-italic'>
				<p>{adresse_1 || UNKNOWN_TEXTS.adresse}</p>
				{adresse_2 && <p>{adresse_2}</p>}
				{adresse_3 ? (
					<p>{adresse_3}</p>
				) : (
					code_postal && nom_commune && <p>{`${code_postal} ${nom_commune}`}</p>
				)}
			</address>
		</article>
	);
};

export default EtablissementCard;
