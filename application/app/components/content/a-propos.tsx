/* eslint-disable react/jsx-key */
import type { StaticPageProps } from '../StaticPage';
import { ACTION_LINKS } from './actions';

/**
 * Content for "À propos" page
 * Reminder :
 * - heading properties are turned into h2 by StaticPage component
 * - paragraphs keys are handled in StaticPage component
 */
const aProposContent: StaticPageProps = {
	title: 'À propos',
	sections: [
		{
			paragraphs: [
				<article className='space-y-6'>
					<p>
						L’application <strong>Établissement Solaire</strong> est un nouvel outil
						pour accélérer la transition énergétique des territoires grâce à nos écoles,
						collèges et lycées.
					</p>
					<p>
						Oui, nos établissements scolaires représentent un atout indéniable : leurs
						toits peuvent accueillir des panneaux solaires, et ainsi participer au
						développement des énergies renouvelables sur les territoires, indispensable
						pour l’avenir énergétique et écologique de la France.
					</p>
					<p>
						Quel plus beau symbole que les lieux d’épanouissement et d’apprentissage des
						enfants pour accueillir l’avenir de la transition énergétique ?
					</p>
					<p>
						Destinée à la fois aux mairies, aux collectivités locales, aux parents
						d’élèves, ou tout simplement aux citoyennes et citoyens,{' '}
						<strong>Établissement Solaire</strong> permet d’évaluer le potentiel solaire
						de chaque bâtiment scolaire public en France.
					</p>
					<p>
						Les écoles peuvent participer à la transition énergétique! L’application{' '}
						<strong>
							<span className='text-sol_ok'>Établissement Solaire</span> vous guide
							pour les trouver
						</strong>
						.
					</p>
					<p>
						<strong className='text-sol_top'>
							Ensemble, agissons pour la transition énergétique de nos territoires !
						</strong>
					</p>
				</article>,
			],
		},
	],
};
export const A_PROPOS_DATA_FOR_GOOD = (
	<>
		<p className='mb-6 mt-6'>
			<strong>Data For Good</strong> est une association loi 1901 créée en 2014 qui rassemble
			une communauté de 6000+ bénévoles tech (Data Scientists, Data Analysts, Data Engineers,
			Developers, UX/UI Designers, Product & Project Owners) souhaitant s‘engager pour
			l‘intérêt général.
		</p>
		<p className='mb-6'>
			Nous réalisons chaque année des saisons d‘accélération où une dizaine de projets sont
			accompagnés par les bénévoles sur des thématiques sociales, sociétales et
			environnementales. Nous avons ainsi accompagné, accéléré et co-construit plus de 1000
			projets depuis 2014.
		</p>
		<p className='mb-6'>
			Nous sommes également fervents critiques des risques et des dérives de la technologie,
			faire partie de la communauté est aussi s‘engager pour une technologie sobre et
			respectueuse des enjeux sociaux et environnementaux, et accepter que la technologie
			n‘est pas la solution à tous les problèmes.
		</p>
		<a
			href={ACTION_LINKS.siteDataForGood.url}
			target='_blank'
			rel='noopener noreferrer'
			className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen hover:underline'
		>
			{ACTION_LINKS.siteDataForGood.label}
		</a>
	</>
);

export const A_PROPOS_GREENPEACE = (
	<>
		<p className='mb-6 mt-6'>
			Créée en 1971, Greenpeace est une organisation non gouvernementale présente dans 55
			pays, grâce à ses 28 bureaux nationaux et régionaux. Un réseau international, solidaire
			et engagé, qui compte plus de trois millions d‘adhérents et d‘adhérentes, et qui est
			animé par des dizaines de milliers de bénévoles. <br />
			Nous plaçons le pouvoir citoyen au cœur de nos campagnes en donnant une résonance au
			travail et aux actions de toutes celles et tous ceux qui partagent notre vision, nos
			espoirs et notre conviction qu‘il faut des transformations profondes de nos sociétés.
		</p>
		<p className='mb-6'>
			Depuis sa création, Greenpeace est une organisation indépendante des États, des pouvoirs
			politiques et économiques, pour qui la non-violence est une valeur fondamentale.
			<br />
			Sur la base de ces valeurs, et grâce au soutien de nos adhérentes, adhérents, militantes
			et militants, Greenpeace mobilise l‘opinion publique, construit des rapports de force et
			oblige les responsables politiques et économiques à se saisir des enjeux sociaux et
			environnementaux.
		</p>
		<p className='mb-6'>
			<strong>Greenpeace France</strong>, forte du soutien de plus de 220 000 adhérentes et
			adhérents, ainsi que de l‘implication d‘environ 700 bénévoles au sein de 35 groupes
			locaux, concentre son action sur la protection des écosystèmes qui agissent comme des
			puits de carbone : les forêts et les océans, ainsi que sur les secteurs les plus
			émetteurs de gaz à effet de serre : l‘agriculture, les transports, l‘énergie.
			<br /> Nous pensons que la transition écologique est une nécessité pour notre société à
			tous les niveaux, et que les établissements scolaires ont pleinement leur rôle à jouer
			dans cette transformation qui sera positive pour notre qualité de vie et la planète.
		</p>
		<a
			href={ACTION_LINKS.siteGreenpeace.url}
			target='_blank'
			rel='noopener noreferrer'
			className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen hover:underline'
		>
			{ACTION_LINKS.siteGreenpeace.label}
		</a>
	</>
);

export default aProposContent;
