import { Etablissement } from '@/app/models/etablissements';

type EtablissementCardProps = Pick<
	Etablissement,
	'nom_etablissement' | 'adresse_1' | 'adresse_2' | 'adresse_3' | 'nb_eleves'
>;

const UNKNOWN_TEXTS = {
	name: 'Nom inconnu',
	adresse: 'Adresse inconnue',
	nb_eleves: "Nombre d'élèves concernés inconnus",
};

const EtablissementCard = ({
	nom_etablissement,
	adresse_1,
	adresse_2,
	adresse_3,
	nb_eleves,
}: EtablissementCardProps) => {
	return (
		<div>
			<h1 className='text-2xl font-bold'>{nom_etablissement || UNKNOWN_TEXTS.name}</h1>
			<p>{adresse_1 || UNKNOWN_TEXTS.adresse}</p>
			<p>{adresse_2 || ''}</p>
			<p>{adresse_3 || ''}</p>

			<br />
			<p>
				{nb_eleves !== null && nb_eleves !== undefined ? (
					<>
						<span className='text-xl'>{nb_eleves}</span> élèves concernés
					</>
				) : (
					UNKNOWN_TEXTS.nb_eleves
				)}
			</p>
		</div>
	);
};

export default EtablissementCard;
