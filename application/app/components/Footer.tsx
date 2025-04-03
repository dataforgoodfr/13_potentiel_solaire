'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowDownCircle } from 'lucide-react';

import logoDataForGood from '../images/DataForGood.svg';
import logoGreenpeace from '../images/greenpeace.svg';
import useWindowSize from '../utils/hooks/useWindowSize';

const links = [
	{
		title: 'Mentions légales',
		href: '/mention-legales',
	},
	{
		title: 'Accéssibilité du site',
		href: '/accessibilite-du-site',
	},
];

export default function Footer() {
	const [isOpen, setIsOpen] = useState(false);
	const width = useWindowSize();

	function handleClick() {
		if (width <= 768) {
			setIsOpen(!isOpen);
		}
	}

	useEffect(() => {
		setIsOpen(width >= 768 ? true : false);
	}, [width]);

	return (
		<>
			<footer
				onClick={handleClick}
				className={`fixed bottom-0 z-50 h-auto w-full transform bg-BG-darkmode pb-6 pt-2 font-verdana text-white transition-all duration-300 ease-in-out md:relative ${!isOpen ? 'translate-y-[72%]' : 'translate-y-[0%]'}`}
			>
				<div className='mx-auto flex w-full place-items-center justify-center gap-2'>
					<span className='h-[1px] w-full max-w-36 bg-light-green md:max-w-full'></span>
					<ArrowDownCircle className='h-8 w-full max-w-8 stroke-light-green md:h-6 md:max-w-6' />
					<span className='h-[1px] w-full max-w-36 bg-light-green md:max-w-full'></span>
				</div>
				<div className='mx-auto max-w-screen-2xl px-6'>
					<section className='flex w-full flex-col items-center justify-around gap-[10px] md:flex-row md:items-end'>
						<div className='w-full max-w-[31.25rem]'>
							<h2 className="mt-3 text-center font-bold after:block after:content-['—'] md:text-left">
								Notre objectif
							</h2>

							<p className='mx-auto mt-3 max-w-80 text-[0.813rem] md:max-w-full'>
								Lorem ipsum dolor sit amet consectetur. At vitae purus iaculis
								sapien sed lectus quisque. Est facilisis id nam nunc.
							</p>
						</div>

						<figure className='mt-3 flex w-full max-w-[31.25rem] place-content-center place-items-center gap-4'>
							<div>
								<Image
									src={logoGreenpeace}
									alt='logo Greepeace'
									className='mx-auto'
									width={45}
									height={45}
								/>
								<div className='mt-[0.625rem] text-xs font-bold text-light-green'>
									Greepeace
								</div>
							</div>
							<span className='h-7 w-7 rounded-full bg-white text-center italic leading-normal text-BG-darkmode'>
								ft.
							</span>
							<div>
								<Image
									src={logoDataForGood}
									alt='logo DataForGood'
									className='mx-auto'
									width={45}
									height={45}
								/>
								<div className='mt-[0.625rem] text-xs font-bold text-light-green'>
									Data For Good
								</div>
							</div>
						</figure>
					</section>

					<section className='space-y-3 pt-12 md:flex md:items-baseline md:justify-center md:gap-12'>
						<div className='text-center text-xs'>
							Tous droits réservés — ©2025 Greenpeace & Data for good
						</div>

						<nav aria-label='footer-principal'>
							<ul className='place-item-baseline flex place-content-center gap-6'>
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className='px-sm py-1 text-center font-verdana text-xs font-bold text-light-green'
										>
											{link.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</section>
				</div>
			</footer>
		</>
	);
}
