import Image from 'next/image';
import Link from 'next/link';

import { ArrowDownCircle } from 'lucide-react';

import logoDataForGood from '../images/DataForGood.svg';
import logoGreenpeace from '../images/greenpeace.svg';

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
	return (
		<>
			<footer className='bg-BG-darkmode pb-6 pt-2 font-verdana text-white'>
				<section className='flex flex-col gap-[10px]'>
					<div className='mx-auto flex w-full place-items-center justify-center gap-2'>
						<span className='h-[1px] w-full max-w-36 bg-white'></span>
						<ArrowDownCircle size={30} className='w-fit stroke-light-green' />
						<span className='h-[1px] w-full max-w-36 bg-white'></span>
					</div>

					<h2 className="mt-3 flex flex-col text-center font-bold after:content-['—']">
						Notre objectif
					</h2>

					<p className='mx-auto mt-3 max-w-80 text-[0.813rem]'>
						Lorem ipsum dolor sit amet consectetur. At vitae purus iaculis sapien sed
						lectus quisque. Est facilisis id nam nunc.
					</p>

					<figure className='mt-3 flex place-content-center place-items-center gap-4'>
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

					<div className='mt-3 text-center text-xs'>
						Tous droits réservés — ©2025 Greenpeace & Data for good
					</div>
				</section>
				<nav aria-label='footer-principal' className='mt-3'>
					<ul className='place-item-baseline flex place-content-center gap-6'>
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className='block px-sm py-1 text-center font-verdana text-xs font-bold text-light-green'
								>
									{link.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</footer>
		</>
	);
}
