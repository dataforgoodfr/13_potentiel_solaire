import { ACTION_LINKS } from '../../content/actions';

const ACTIONS = [
	{
		title: 'Je suis un élu et je veux agir',
		content: (
			<>
				{/* TODO: use in page action instead */}
				{/* <p>Merci pour votre intérêt pour la transition énergétique de votre territoire !</p>
				<p>
					Les toitures des bâtiments scolaires offrent une importante opportunité, avec un
					impact environnemental minime, pour développer les énergies renouvelables sur
					votre territoire.  Ces installations présentent également des vertus
					pédagogiques pour sensibiliser et former les générations futures aux enjeux de
					transition énergétique.  
				</p>
				<p>
					C’est aussi, une fois l’investissement remboursé, une opportunité de réduire les
					factures énergétiques de la commune tout en réduisant son empreinte carbone !
				</p>
				<br />
				<p>
					A Greenpeace France, nous pensons que pour réussir la transition énergétique des
					bâtiments publics, ces projets solaires doivent s’inscrire dans une réflexion
					plus générale sur l’état du bâti. Pour les bâtiments passoires énergétiques il
					est indispensable de les rénover de façon performante avant d’y installer des
					panneaux solaires.
				</p>
				<br /> */}

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
		content: (
			<>
				{/* TODO: use in page action instead */}
				{/* <p>Merci pour votre intérêt pour la transition énergétique de votre territoire !</p>
				<p>
					L’école est l’un des bâtiments essentiels de notre territoire : elle forme les
					générations futures, est un lieu de rencontres, d’égalité et de mixité sociale. 
				</p>
				<p>
					Votre commune a donc un devoir d’action et d’exemplarité sur les écoles : trop
					d’écoles ont un bâti dégradé, inadapté à des conditions d’apprentissage propices
					à la réussite scolaire et qui peut engendrer des problèmes de santé (asthmes,
					allergies, problèmes respiratoires, malaises, …).
				</p>
				<p>
					C’est pourquoi nous pensons que la transition des écoles doit être un des
					piliers d’action de votre mairie : rénovation des bâtiments scolaires, pose de
					panneaux solaires sur les toitures, végétalisation des cours, sensibilisation à
					la transition écologique, …
				</p>
				<br /> */}
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
			{ACTIONS.map(({ title, content }) => (
				<details
					key={title}
					className='mb-2 rounded-md border bg-blue p-2 text-sm text-white'
				>
					<summary className='cursor-pointer font-bold'>{title}</summary>
					<br />
					{content}
				</details>
			))}
		</div>
	);
};

export default AccordionCard;
