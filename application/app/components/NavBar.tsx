'use client';

import Link from 'next/link';
import Image from "next/image";
import imgLogo from "../images/logo.svg"

import { useState, KeyboardEvent } from 'react';
import { Menu, X, Search, LocateFixed, ListFilter } from 'lucide-react';

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
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	}

	const handleClose = (e:KeyboardEvent<HTMLButtonElement>) => {
		if(e.code === 'Escape'){
			setIsOpen(false);
		};
	}

	const handleKeypress = (e:KeyboardEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if(e.code === 'Escape'){
			setIsOpen(false);
		};
		
		if(e.code === 'Enter')
		{
			setIsOpen(!isOpen);
		};
	}

	return (
		<section className='py-[10px] px-5 bg-BG-darkmode'>
			<div className='mx-auto flex flex-row-reverse w-full items-end justify-between h-[3.375rem]'>
				
				<Link href='/'>
					<Image src={imgLogo} alt="logo" width={108} height={33}/>
				</Link>

				<button className="text-white items-end" onClick={handleToggle} onKeyDown={handleKeypress} type="button" aria-expanded={isOpen} aria-controls="menu-principal" aria-label="Toggle Menu">
        			<span className="sr-only">Open menu</span>
					{isOpen ? <X className='stroke-light-green' /> : <Menu className='stroke-light-green' /> }
				</button>

				<nav onKeyDown={handleClose} aria-label='menu-principal' className={`absolute  left-0 top-0 bg-BG-darkmode p-5 rounded-md shadow-primary translate-x-sm z-50 transition-all ease-in-out
					${isOpen ? "duration-300 translate-y-20 pointer-events-auto " : "duration-150 -translate-y-0 opacity-0 pointer-events-none "}`}>
					<ul>
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className='block px-sm py-1 text-white text-base font-verdana'>
									{link.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<section className='mt-4 flex place-content-center place-items-center gap-4 w-full'>
				<div className='relative w-full'>
					<Search className='absolute top-1/2 left-2 stroke-[#EBEBF599] -translate-y-1/2' size={15.5}/>
					<input type="text" className='w-full py-[0.438rem] px-8 rounded-[0.625rem] text-base bg-[#7676803D] font-verdana  leading-[-0.41px] focus:outline-1 focus:outline-offset-2 focus:outline-sol-ok outline-none placeholder:text-[#EBEBF5/60] text-[#EBEBF5]' placeholder='Entrez une ville, une adresse...' />
					<LocateFixed className='absolute top-1/2 right-2 stroke-light-green -translate-y-1/2' size={24}/>
				</div>
				<ListFilter className='stroke-light-green cursor-pointer' size={24}/>
			</section>

		</section>
	);
}


