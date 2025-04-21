import { Etablissement } from '@/app/models/etablissements';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3'
>;

const UNKNOWN_TEXTS = {
	name: 'Nom inconnu',
	adresse: 'Adresse inconnue',
};

//TODO: if adresse_3 is null => use code_postal + nom_commune (à confirmer au niveau data)
const EtablissementCard = ({
	nom_etablissement,
	adresse_1,
	adresse_2,
	adresse_3,
}: EtablissementCardProps) => {
	return (
		<div className='text-blue'>
			<h1 className='text-2xl font-bold'>{nom_etablissement || UNKNOWN_TEXTS.name}</h1>
			<p>{adresse_1 || UNKNOWN_TEXTS.adresse}</p>
			{adresse_2 && <p>{adresse_2}</p>}
			{adresse_3 && <p>{adresse_3}</p>}
		</div>
	);
};

export default EtablissementCard;
