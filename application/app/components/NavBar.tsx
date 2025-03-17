import Link from 'next/link';

import { APP_NAME } from '../config/constants';

const links = [
	{
		title: 'Accueil',
		href: '/',
	},
	{
		title: 'Source & méthodologie',
		href: '/source-methodology',
	},
	{
		title: 'A propos',
		href: '/about',
	},
];

export default function NavBar() {
	return (
		<nav className='bg-accent'>
			<div className='mx-auto flex max-w-screen-xl items-center justify-between p-sm'>
				<Link href='/'>
					<div className='text-2xl font-semibold'>{APP_NAME}</div>
				</Link>
				<ul className='mt-sm flex flex-col p-sm font-medium md:mt-0 md:flex-row md:space-x-md md:p-0'>
					{links.map((link) => (
						<li key={link.href}>
							<Link href={link.href} className='block px-sm py-xs md:p-0'>
								{link.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
