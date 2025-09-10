'use client';

import StaticPage from '../components/StaticPage';
import aProposContent from '../components/content/a-propos';

export default function CommentAgirPage() {
	return (
		<>
			<main className='mx-auto flex max-w-6xl justify-evenly px-4 py-8 pb-40'>
				<StaticPage {...aProposContent} />
			</main>
		</>
	);
}
