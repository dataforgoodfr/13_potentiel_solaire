const TEXTS = {
	ARIA_LABEL: "Liens d'accès rapide",
	MAIN_CONTENT: 'Aller au contenu',
	FOOTER: 'Aller au pied de page - Notre objectif',
};

export default function SkipLinks() {
	return (
		<nav
			aria-label={TEXTS.ARIA_LABEL}
			className='sr-only w-full border-b border-gray-200 bg-gray-50 focus-within:not-sr-only'
		>
			<ul className='flex justify-start space-x-2 p-2'>
				<li>
					<a
						href='#main-content'
						className='focus rounded bg-white px-2 py-1 text-blue shadow transition hover:underline focus:outline focus:outline-2 focus:outline-blue'
					>
						{TEXTS.MAIN_CONTENT}
					</a>
				</li>
				<li>
					<a
						href='#footer'
						className='focus rounded bg-white px-2 py-1 text-blue shadow transition hover:underline focus:outline focus:outline-2 focus:outline-blue'
					>
						{TEXTS.FOOTER}
					</a>
				</li>
			</ul>
		</nav>
	);
}
