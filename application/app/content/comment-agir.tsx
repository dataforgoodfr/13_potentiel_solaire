/* eslint-disable react/jsx-key */
import type { StaticPageProps } from '../components/StaticPage';

/**
 * Content for "Comment agir ?" page
 * Reminder :
 * - heading properties are turned into h2 by StaticPage component
 * - paragraphs keys are handled in StaticPage component
 */
const commentAgirContent: StaticPageProps = {
	title: 'Comment agir ?',
	sections: [
		{
			paragraphs: [
				<p className='mb-8'>
					<strong>
						Merci pour votre intérêt pour la transition énergétique de votre territoire
						!
					</strong>
				</p>,
				<section className='space-y-6'>
					<p>
						<span className=''>
							L&apos;École est l&apos;un des bâtiments essentiels de notre territoire
							: elle forme les générations futures, est un lieu de rencontres,
							d&apos;égalité et de mixité sociale.
						</span>
					</p>
					<p>
						<span className=''>
							Ensemble, nous pouvons agir concrètement pour faire avancer la
							transition des écoles sur vos territoires.
						</span>
					</p>
					<p>
						<strong className='text-sol_top'>﹥ Voyons comment agir :</strong>
					</p>
				</section>,
			],
		},
	],
};

export default commentAgirContent;
