'use client';

import { KeyboardEvent, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ListFilter, LocateFixed, Menu, Search, X } from 'lucide-react';

import imgLogo from '../../public/images/logo.svg';
import useWindowSize from '../utils/hooks/useWindowSize';

const links = [
	{
		title: 'Accueil',
		href: '/',
	},
	{
		title: 'Comment agir ?',
		href: '/comment-agir',
	},
	{
		title: 'Notre méthodologie',
		href: '/notre-methodologie',
	},
	{
		title: 'A propos',
		href: '/a-propos',
	},
];

export default function NavBar() {
	const pathname = usePathname();

	const [isOpen, setIsOpen] = useState(false);
	const width = useWindowSize();

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleClose = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.code === 'Escape') {
			setIsOpen(false);
		}
	};

	const handleKeypress = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.code === 'Escape') {
			setIsOpen(false);
		}

		if (e.code === 'Enter') {
			e.preventDefault();
			setIsOpen(!isOpen);
		}
	};

	return (
		<section className='bg-BG-darkmode px-5 py-[10px]'>
			<div className='mx-auto flex flex-row-reverse items-center justify-between md:flex-row md:gap-6'>
				<Link href='/'>
					<Image src={imgLogo} alt='logo' className='w-[6.75rem] lg:w-[11.125rem]' />
				</Link>

				<section className='hidden flex-auto place-items-center gap-4 xl:flex'>
					<div className='relative w-full max-w-[25rem]'>
						<Search
							className='absolute left-2 top-1/2 -translate-y-1/2 stroke-[#EBEBF599]'
							size={15.5}
						/>

						<input
							type='text'
							className='w-full rounded-[0.625rem] bg-[#7676803D] px-8 py-[0.438rem] font-verdana text-base leading-[0.41px] text-[#EBEBF5] outline-none placeholder:text-[#EBEBF5/60] focus:outline-1 focus:outline-offset-2 focus:outline-sol-ok'
							placeholder='Entrez une ville, une adresse...'
						/>

						<LocateFixed
							className='absolute right-2 top-1/2 -translate-y-1/2 stroke-light-green'
							size={24}
						/>
					</div>
					<ListFilter className='cursor-pointer stroke-light-green' size={24} />
				</section>

				<button
					className='items-end text-white md:hidden'
					onClick={handleToggle}
					onKeyDown={handleKeypress}
					type='button'
					aria-expanded={isOpen}
					aria-controls='menu-principal'
					aria-label='Toggle Menu'
				>
					<span className='sr-only'>Open menu</span>
					{isOpen ? (
						<X className='stroke-light-green' />
					) : (
						<Menu className='stroke-light-green' />
					)}
				</button>

				<nav
					onKeyDown={handleClose}
					aria-label='menu-principal'
					className={`absolute left-0 top-0 z-50 translate-x-sm rounded-md bg-BG-darkmode p-5 shadow-primary transition-all ease-in-out md:pointer-events-auto md:relative md:left-auto md:right-0 md:ml-auto md:-translate-x-sm md:justify-self-end md:p-0 md:opacity-100 ${isOpen ? 'pointer-events-auto translate-y-20 duration-300' : 'pointer-events-none -translate-y-0 opacity-0 duration-150'}`}
				>
					<ul className='md:flex md:space-x-0'>
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									tabIndex={!isOpen && width < 768 ? -1 : 0}
									className={` ${pathname === link.href ? 'text-dark-green' : 'text-light-green'} 'block lg:underline-offset-[0.3rem]' px-sm py-1 font-verdana text-base font-bold lg:text-lg lg:underline lg:decoration-dotted`}
								>
									{link.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<section className='mt-4 flex w-auto place-content-center place-items-center gap-4 md:max-w-96 xl:hidden'>
				<div className='relative w-full'>
					<Search
						className='absolute left-2 top-1/2 -translate-y-1/2 stroke-[#EBEBF599]'
						size={15.5}
					/>
					<input
						type='text'
						className='w-full rounded-[0.625rem] bg-[#7676803D] px-8 py-[0.438rem] font-verdana text-base leading-[-0.41px] text-[#EBEBF5] outline-none placeholder:text-[#EBEBF5/60] focus:outline-1 focus:outline-offset-2 focus:outline-sol-ok'
						placeholder='Entrez une ville, une adresse...'
					/>
					<LocateFixed
						className='absolute right-2 top-1/2 -translate-y-1/2 stroke-light-green'
						size={24}
					/>
				</div>
				<ListFilter className='cursor-pointer stroke-light-green' size={24} />
			</section>
		</section>
	);
}
