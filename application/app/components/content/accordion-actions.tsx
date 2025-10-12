import { ACTION_LINKS } from './actions';

export const ELU_INTRO_LONG = (
	<>
		<p className='mb-6 mt-6'>
			Les toitures des bâtiments scolaires offrent une importante opportunité, avec un impact
			environnemental minime, pour développer les énergies renouvelables sur votre territoire.
		</p>
		<p className='mb-6'>
			Ces installations présentent également des vertus pédagogiques pour sensibiliser et
			former les générations futures aux enjeux de transition énergétique. C’est aussi, une
			fois l’investissement remboursé, une opportunité de réduire les factures énergétiques de
			la commune tout en réduisant son empreinte carbone !
		</p>
		<p className='mb-6'>
			À Greenpeace France, nous pensons que pour réussir la transition énergétique des
			bâtiments publics, ces projets solaires doivent s’inscrire dans une réflexion plus
			générale sur l’état du bâti. Pour les bâtiments passoires énergétiques il est
			indispensable de les rénover de façon performante avant d’y installer des panneaux
			solaires.
		</p>
	</>
);

export const ELU_BODY = (
	<ul className='list-inside list-disc'>
		<li className='mb-8 mt-6'>
			De nombreuses communes nous ont fait remonter leurs difficultés à financer ces projets,
			de rénovation comme de panneaux photovoltaïques, par manque de moyens financiers mis par
			l’État.
			<p className='font-bold'>
				Si cela est votre cas, nous vous invitons à nous contacter à l’adresse suivante :
			</p>
			{/* mailto: donc pas besoin de target blank */}
			<a
				href={ACTION_LINKS.contact.url}
				className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen hover:underline'
			>
				{ACTION_LINKS.contact.label}
			</a>
		</li>
		<li className='mb-10'>
			De multiples démarches sont nécessaires pour monter un tel projet : conformité avec le
			PLU(i) et si dans zone protégée avis des ABF, étude de faisabilité, modèle économique,
			plan de financement, demande de subventions, demande de raccordement au réseau, …
			<br />
			<span className='font-bold'>
				Voici quelques ressources pour vous aider dans l’élaboration de ces projets :
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
				de l’association Hespul, avec les étapes pour réaliser un projet
			</p>
			<p>
				– Le guide{' '}
				<a
					href='https://amorce.asso.fr/publications/guide-l-elu-et-le-photovoltaique-enp65'
					target='_blank'
					rel='noopener noreferrer'
					className='text-green underline decoration-dotted decoration-2 underline-offset-4'
				>
					L’ÉLU et le photovoltaïque
				</a>
				&nbsp;du réseau AMORCE
			</p>
			<p>
				– La plaquette{' '}
				<a
					href='https://github.com/user-attachments/files/22429562/Plaquette_Simuler.mon.raccordement.VF.pdf'
					target='_blank'
					rel='noopener noreferrer'
					className='text-green underline decoration-dotted decoration-2 underline-offset-4'
				>
					Simuler mon raccordement en ligne
				</a>
				&nbsp;(PDF de 196.5ko) d&apos;Enedis.
			</p>
			<p>
				– Le guide à l&apos;usage des collectivités locales (PDF de 1.6mo){' '}
				<a
					href='https://energie-partagee.org/wp-content/uploads/2020/12/BDT-2020-Guide-collectivite%CC%81s-Mieux-maitriser-de%CC%81veloppement-EnR-sur-territoire.pdf'
					target='_blank'
					rel='noopener noreferrer'
					className='text-green underline decoration-dotted decoration-2 underline-offset-4'
				>
					Mieux maîtriser le développement des EnR sur son territoire
				</a>
				&nbsp;de la Banque des Territoires
			</p>
		</li>
	</ul>
);

export const PARTICULIER_INTRO_SHORT = (
	<p className='font-bold'>
		Ensemble, nous pouvons agir concrètement pour faire avancer la transition sur vos
		territoires :
	</p>
);

export const PARTICULIER_INTRO_LONG = (
	<>
		<p className='mb-6 mt-6'>
			L’école est l’un des bâtiments essentiels de notre territoire : elle forme les
			générations futures, est un lieu de rencontres, d’égalité et de mixité sociale.
		</p>
		<p className='mb-6'>
			Votre commune a donc un devoir d’action et d’exemplarité sur les écoles : trop d’écoles
			ont un bâti dégradé, inadapté à des conditions d’apprentissage propices à la réussite
			scolaire et qui peut engendrer des problèmes de santé (asthmes, allergies, problèmes
			respiratoires, malaises, …).
		</p>
		<p className='mb-6'>
			C’est pourquoi nous pensons que la transition des écoles doit être un des piliers
			d’action de votre mairie : rénovation des bâtiments scolaires, pose de panneaux solaires
			sur les toitures, végétalisation des cours, sensibilisation à la transition écologique,
			…
		</p>
	</>
);

export const PARTICULIER_BODY = (
	<>
		<p className='mb-6 font-bold'>
			Ensemble, nous pouvons agir concrètement pour faire avancer la transition sur vos
			territoires :
		</p>
		<ul className='list-inside list-disc'>
			<li className='mb-8 mt-2'>
				Signer notre pétition nationale demandant des moyens et des actions d’urgence pour
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
				sur le potentiel solaire des écoles de la commune et interroger pour savoir ce
				qu’elle prévoit de faire :
				<a
					href={ACTION_LINKS.contactElu.url}
					target='_blank'
					rel='noopener noreferrer'
					className='my-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
				>
					{ACTION_LINKS.contactElu.label}
				</a>
				<em>
					<strong>Information utile</strong>&nbsp;: Sur le site adresses-mairies.fr
					cherchez votre commune dans la barre de recherche puis copiez l’adresse mail
					présente sur la fiche de votre élu(e).
				</em>
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
		</ul>
	</>
);

export const PARTICULIER_END = (
	<ul className='list-inside list-disc'>
		<li>
			Pour plus en savoir plus, rendez-vous sur la page “Comment agir ?” :
			<p className='mb-4'>
				<a
					href={ACTION_LINKS.commentAgir.url}
					className='text-green underline decoration-dotted decoration-2 underline-offset-4'
				>
					— {ACTION_LINKS.commentAgir.label}
				</a>
			</p>
		</li>
	</ul>
);
