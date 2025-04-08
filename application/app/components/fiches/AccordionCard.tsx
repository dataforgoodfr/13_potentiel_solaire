const ACTION_TITLES: string[] = [
	'Je suis un élu et je veux agir',
	'Je suis un particulier et je veux agir',
];

const AccordionCard = () => {
	return (
		<div>
			{ACTION_TITLES.map((title) => (
				<details key={title} className='mb-2 rounded-md border bg-blue p-2 text-white'>
					<summary className='cursor-pointer font-bold'>{title}</summary>
					<br />
					<p>
						Lorem ipsum dolor sit amet consectetur. Aliquet bibendum vitae eget tempor
						velit sit laoreet sed. Nec sit mi urna aenean morbi.
					</p>
					<br />
					<ul>
						<li className='flex items-center space-x-2'>
							<span className='inline-block h-1 w-1 rounded-full bg-white'></span>
							<p>Contacter votre élu pour lui demander d&apos;agir :</p>
						</li>
						<button className='w-full rounded-md bg-green px-4 py-2 font-medium text-darkgreen'>
							Contacter par mail mon élu
						</button>
						<li className='flex items-center space-x-2'>
							<span className='inline-block h-1 w-1 rounded-full bg-white'></span>
							<p className='mt-2'>
								Signer la pétition pour demander la rénovation énergétique des
								bâtiments scolaires :
							</p>
						</li>
						<button className='w-full rounded-md bg-green px-4 py-2 font-medium text-darkgreen'>
							Signez la pétition nationale
						</button>
					</ul>
					<br />
					<p className='mt-2'>
						Découvrez les projets de transition énergétique près de chez vous :
					</p>
					<p className='text-green'>- Carte de l&apos;énergie citoyenne</p>
				</details>
			))}
		</div>
	);
};

export default AccordionCard;
