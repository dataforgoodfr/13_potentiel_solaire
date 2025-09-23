'use client';

import StaticPage from '../components/StaticPage';
import notreMethodologieContent from '../components/content/notre-methodologie';

export default function NotreMethodologiePage() {
	return (
		<div className='mx-auto max-w-5xl px-4 py-8'>
			<StaticPage {...notreMethodologieContent} />
		</div>
	);
}
