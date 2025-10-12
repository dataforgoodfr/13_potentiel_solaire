import { Metadata } from 'next';

import StaticPage from '../components/StaticPage';
import notreMethodologieContent from '../content/methodologie';
import { PAGE_METHODOLOGIE_METADATA } from '../content/seo';

export const metadata: Metadata = PAGE_METHODOLOGIE_METADATA;

export default function NotreMethodologiePage() {
	return (
		<div className='mx-auto max-w-5xl px-4 pb-40'>
			<StaticPage {...notreMethodologieContent} />
		</div>
	);
}
