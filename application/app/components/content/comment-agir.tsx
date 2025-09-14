import type { StaticPageProps } from '../StaticPage';

const commentAgirContent: StaticPageProps = {
	title: 'Comment agir ?',
	sections: [
		{
			heading: '',
			paragraphs: [
				<strong key='1' className='mb-8'>
					Merci pour votre intérêt pour la transition énergétique de votre territoire !
				</strong>,

				<span key='2' className=''>
					L&apos;École est l&apos;un des bâtiments essentiels de notre territoire : elle
					forme les générations futures, est un lieu de rencontres, d&apos;égalité et de
					mixité sociale.
				</span>,

				<span key='3' className=''>
					Ensemble, nous pouvons agir concrètement pour faire avancer la transition des
					écoles sur vos territoires.
				</span>,

				<strong key='4' className='text-sol_top'>
					﹥ Voyons comment agir :
				</strong>,
			],
		},
	],
};

export default commentAgirContent;
