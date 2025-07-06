import { ACTION_LINKS } from '../../content/actions';

const ACTIONS = [
	{
		title: 'Je suis un élu et je veux agir',
		id: 'elu',
		content: (
			<>
				<ul className='list-inside list-disc'>
					<li className='mb-8 mt-2'>
						De nombreuses communes nous ont fait remonter leurs difficultés à financer
						ces projets, de rénovation comme de panneaux photovoltaïques, par manque de
						moyens financiers mis par l’État.
						<span className='font-bold'>
							&nbsp;Si cela est votre cas, nous vous invitons à nous contacter à
							l’adresse suivante
						</span>
						<a
							href={ACTION_LINKS.contact.url}
							className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen hover:underline'
						>
							{ACTION_LINKS.contact.label}
						</a>
					</li>
					<li>
						De multiplies démarches sont nécessaires pour monter un tel projet :
						conformité avec le PLU(i) et si dans zone protégée avis des ABF, étude de
						faisabilité, modèle économique, plan de financement, demande de subventions,
						demande de raccordement au réseau, … 
						<br />
						<span className='font-bold'>
							Voici quelques ressources pour vous aider dans l’élaboration de ces
							projets :
						</span>
						<br />
						<p className='mt-3'>
							– Le site{' '}
							<a
								href='https://www.photovoltaique.info'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green underline decoration-dotted decoration-2 underline-offset-4'
							>
								photovoltaïque.info
							</a>{' '}
							de l’association Hespul
						</p>
						<p>
							– Le guide{' '}
							<a
								href='https://www.amorce.asso.fr/publications/elu-et-photovoltaique'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green underline decoration-dotted decoration-2 underline-offset-4'
							>
								L’ÉLU et le photovoltaïque
							</a>
						</p>
						<p>
							– Le guide{' '}
							<a
								href='https://www.banquedesterritoires.fr/energies-renouvelables-guide-collectivites'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green underline decoration-dotted decoration-2 underline-offset-4'
							>
								Mieux maîtriser le développement des EnR sur son territoire
							</a>
						</p>
					</li>
				</ul>
				<br />
			</>
		),
	},
	{
		title: 'Je suis un particulier et je veux agir',
		id: 'particulier',
		content: (
			<>
				<p className='font-bold'>
					Ensemble, nous pouvons agir concrètement pour faire avancer la transition sur
					vos territoires :
				</p>
				<br />
				<ul className='list-inside list-disc'>
					<li className='mb-8 mt-2'>
						Signer notre pétition nationale demandant des moyens et des actions
						d’urgence pour
						<span className='font-bold'>
							&nbsp;la rénovation énergétique des établissements scolaires :
						</span>
						<a
							href={ACTION_LINKS.petition.url}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
						>
							{ACTION_LINKS.petition.label}
						</a>
					</li>
					<li className='mb-8'>
						Informer
						<span className='font-bold'>&nbsp;votre mairie&nbsp;</span>
						sur le potentiel solaire des écoles de la commune et interroger pour savoir
						ce qu’elle prévoit de faire :
						<button className='mt-3 w-full rounded-md bg-green px-4 py-2 font-bold text-darkgreen'>
							Contacter par mail mon élu
						</button>
					</li>
					<li className='mb-8'>
						Découvrez les projets de transition énergétique près de chez vous :
						<p>
							<a
								href='https://energie-partagee.org/projets/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-green underline decoration-dotted decoration-2 underline-offset-4'
							>
								— Carte de l’énergie citoyenne
							</a>
						</p>
					</li>
					<li>
						Pour plus en savoir plus, rendez-vous sur la page “Comment agir ?” de notre
						site :
						<p>
							<a
								href={ACTION_LINKS.commentAgir.url}
								className='text-green underline decoration-dotted decoration-2 underline-offset-4'
							>
								— {ACTION_LINKS.commentAgir.label}
							</a>
						</p>
					</li>
				</ul>
			</>
		),
	},
];

const AccordionCard = () => {
	return (
		<div>
			{ACTIONS.map(({ title, content, id }) => {
				const summaryId = `summary-${id}`;
				const contentId = `content-${id}`;

				return (
					<details
						key={id}
						className='mb-2 rounded-md border bg-blue p-2 text-sm text-white'
					>
						<summary
							id={summaryId}
							aria-controls={contentId}
							className='cursor-pointer font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
						>
							{title}
						</summary>

						<div
							id={contentId}
							role='region'
							aria-labelledby={summaryId}
							className='mt-3'
						>
							{content}
						</div>
					</details>
				);
			})}
		</div>
	);
};

export default AccordionCard;
