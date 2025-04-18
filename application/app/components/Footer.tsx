'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpCircle } from 'lucide-react';

import logoDataForGood from '../images/DataForGood.svg';
import logoGreenpeace from '../images/greenpeace.svg';

const links = [
	{ title: 'Mentions légales', href: '/mention-legales' },
	{
		title: 'Jeu de données ouvert',
		href: 'https://github.com/dataforgoodfr/13_potentiel_solaire',
	},
	{ title: 'Accessibilité du site', href: '/accessibilite-du-site' },
];

export default function Footer() {
	const [isOpen, setIsOpen] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [maxHeight, setMaxHeight] = useState('0px');

	useEffect(() => {
		if (contentRef.current) {
			setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
		}
	}, [isOpen]);

	return (
		<footer className='fixed bottom-0 z-40 w-full bg-blue text-white'>
			<div className='flex w-full items-center justify-center border-t border-green bg-blue py-2'>
				<button
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					className='flex cursor-pointer items-center gap-2'
				>
					<ArrowUpCircle
						className={`h-6 w-6 stroke-green transition-transform ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
					<span className='sr-only'>Afficher / cacher le pied de page</span>
				</button>
			</div>

			<div
				className='overflow-hidden transition-all duration-500 ease-in-out'
				style={{ maxHeight }}
			>
				<div ref={contentRef} className='mx-auto max-w-screen-xl px-6 pb-6 pt-4'>
					{/* Open view */}
					<div
						className={`flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between`}
					>
						<div className='text-center lg:max-w-xl lg:text-left'>
							<h2 className='text-lg font-bold'>Notre objectif</h2>
							<div className='mx-auto my-2 h-[1px] w-5 bg-green lg:mx-0'></div>
							<br />
							<p className='text-left text-sm leading-relaxed'>
								L’outil <span className='font-bold'>Établissement Solaire</span>{' '}
								permet d’évaluer le potentiel des toitures des établissements
								scolaires français pour accueillir des panneaux solaires
								photovoltaïques. Interactif, avec des données accessibles et libres,
								il permet d’aider les habitant·es et les collectivités locales à
								connaître le potentiel de leur territoire et à agir pour développer
								les énergies renouvelables près de chez eux.
							</p>
						</div>
						<div className='flex flex-col items-center gap-4 lg:items-start'>
							<div className='flex items-center gap-4'>
								<div className='flex flex-col items-center lg:items-start'>
									<Image
										src={logoGreenpeace}
										alt='Logo Greenpeace'
										width={45}
										height={45}
									/>
									<div className='mt-2 text-xs font-bold text-light-green'>
										Greenpeace
									</div>
									<div className='mt-1 text-center text-[0.7rem] lg:text-left'>
										13 rue d’Enghien
										<br />
										75010 Paris
										<br />
										Tel : 01 80 96 96 96
									</div>
								</div>

								<div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg italic text-blue'>
									ft.
								</div>

								<div className='flex flex-col items-center lg:items-start'>
									<Image
										src={logoDataForGood}
										alt='Logo Data For Good'
										width={45}
										height={45}
									/>
									<div className='mt-2 text-xs font-bold text-light-green'>
										Data For Good
									</div>
									<div className='mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-center text-[0.7rem] text-green lg:text-left'>
										<a
											href='https://github.com/dataforgoodfr'
											target='_blank'
											rel='noopener noreferrer'
											aria-label='Data For Good sur Github'
											className='hover:underline'
										>
											Github
										</a>
										<a
											href='https://huggingface.co/DataForGood'
											target='_blank'
											rel='noopener noreferrer'
											aria-label='Data For Good sur Hugging Face'
											className='hover:underline'
										>
											Hugging Face
										</a>
										<a
											href='https://www.youtube.com/channel/UCA_utdbmVhAOFujulWlaaCQ'
											target='_blank'
											rel='noopener noreferrer'
											aria-label='Data For Good sur YouTube'
											className='hover:underline'
										>
											Youtube
										</a>
										<a
											href='https://www.twitch.tv/dataforgood'
											target='_blank'
											rel='noopener noreferrer'
											aria-label='Data For Good sur Twitch'
											className='hover:underline'
										>
											Twitch
										</a>
										<a
											href='https://www.meetup.com/data-for-good-fr/'
											target='_blank'
											rel='noopener noreferrer'
											aria-label='Data For Good sur Meetup'
											className='hover:underline'
										>
											Meetup
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-around'>
						<div className='text-center text-xs'>
							Tous droits réservés — © 2025 Greenpeace & Data for Good
						</div>
						<nav aria-label='footer-links'>
							<ul className='flex flex-wrap justify-center gap-4'>
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className='text-xs text-green hover:underline'
										>
											{link.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>
			</div>

			{/* Close view */}
			{!isOpen && (
				<div className='flex items-center justify-center gap-4 bg-blue py-2'>
					<Image src={logoGreenpeace} alt='Logo Greenpeace' width={35} height={35} />
					<span className='text-sm font-semibold italic text-white'>ft.</span>
					<Image src={logoDataForGood} alt='Logo Data For Good' width={35} height={35} />
				</div>
			)}
		</footer>
	);
}
