import { Metadata } from 'next';

import StaticPage from '../components/StaticPage';
import mentionsLegalesContent from '../content/mentions-legales';
import { PAGE_MENTIONS_LEGALES_METADATA } from '../content/seo';

export const metadata: Metadata = PAGE_MENTIONS_LEGALES_METADATA;

export default function MentionsLegalesPage() {
	return (
		<div className='mx-auto max-w-5xl px-4 pb-40'>
			<StaticPage {...mentionsLegalesContent} />
		</div>
	);
}
