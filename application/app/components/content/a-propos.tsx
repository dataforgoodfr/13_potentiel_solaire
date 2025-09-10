import type { StaticPageProps } from '../StaticPage';

const aProposContent: StaticPageProps = {
	title: 'À propos',
	picture: {
		src: '/images/kids.png',
		alt: 'groupe d‘enfants sous le soleil',
		width: 455,
	},
	sections: [
		{
			heading: '',
			paragraphs: [
				<>
					L’application <strong>Établissement Solaire</strong> est un nouvel outil pour
					accélérer la transition énergétique des territoires grâce à nos écoles, collèges
					et lycées.
				</>,
				<>
					Oui, nos établissements scolaires représentent un atout indéniable : leurs toits
					peuvent accueillir des panneaux solaires, et ainsi participer au développement
					des énergies renouvelables sur les territoires, indispensable pour l’avenir
					énergétique et écologique de la France.
				</>,
				<>
					Quel plus beau symbole que les lieux d’épanouissement et d’apprentissage des
					enfants pour accueillir l’avenir de la transition énergétique ?
				</>,
				<>
					Destinée à la fois aux mairies, aux collectivités locales, aux parents d’élèves,
					ou tout simplement aux citoyennes et citoyens,{' '}
					<strong>Établissement Solaire</strong> permet d’évaluer le potentiel solaire de
					chaque bâtiment scolaire public en France.
				</>,
				<>
					Les écoles peuvent participer à la transition énergétique! L’application{' '}
					<strong>
						<span className='text-sol_ok'>Établissement Solaire</span> vous guide pour
						les trouver
					</strong>
					.
				</>,
				<>
					<strong className='text-sol_top'>
						Ensemble, agissons pour la transition énergétique de nos territoires !
					</strong>
				</>,
			],
		},
	],
};

export default aProposContent;
