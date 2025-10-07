'use client';

import StaticPage from '../components/StaticPage';
import notreMethodologieContent from '../components/content/notre-methodologie';

export default function NotreMethodologiePage() {
	return (
		<div className='mx-auto max-w-5xl px-4 pb-40'>
			<StaticPage {...notreMethodologieContent} />
		</div>
	);
}
