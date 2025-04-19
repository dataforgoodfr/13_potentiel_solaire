'use client';

import { KeyboardEvent, Suspense, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ListFilter, Menu, X } from 'lucide-react';

import imgLogo from '../../public/images/logo.svg';
import { SearchResult } from '../models/search';
import { useInitialView } from '../utils/providers/initialViewProvider';
import SearchBar from './SearchBar/SearchBar';

const links = [
	{ title: 'Accueil', href: '/' },
	{ title: 'Comment agir ?', href: '/comment-agir' },
	{ title: 'Notre méthodologie', href: '/notre-methodologie' },
	{ title: 'À propos', href: '/about' },
];

export default function NavBar() {
	const { isInitialView } = useInitialView();
	const [isOpen, setIsOpen] = useState(false);

	const handleSearchSelect = (selection: SearchResult) => {
		alert(selection.libelle + ' - ' + selection.source);
	};

	const handleToggle = () => setIsOpen(!isOpen);

	const handleClose = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.code === 'Escape') setIsOpen(false);
	};

	const handleKeypress = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.code === 'Escape') setIsOpen(false);
		if (e.code === 'Enter') {
			e.preventDefault();
			setIsOpen(!isOpen);
		}
	};

	return (
		<header className='bg-blue px-4 py-2'>
			<div className='flex flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-center xl:justify-between'>
				{/* Bloc gauche : menu (mobile) + logo */}
				<div className='flex w-full items-center justify-between xl:w-auto xl:justify-start xl:gap-6'>
					{/* Burger menu */}
					<button
						className='text-white xl:hidden'
						onClick={handleToggle}
						onKeyDown={handleKeypress}
						type='button'
						aria-expanded={isOpen}
						aria-controls='menu-principal'
						aria-label='Toggle Menu'
					>
						{isOpen ? (
							<X className='stroke-green' />
						) : (
							<Menu className='stroke-green' />
						)}
					</button>

					{/* Logo */}
					<Link href='/' className='flex-none xl:ml-0'>
						<Image src={imgLogo} alt='logo' width={108} height={33} />
					</Link>
				</div>

				{/* Bloc SearchBar + boutons */}
				{/* //TODO: navbar should not be visible in other page than home */}
				{!isInitialView && (
					<div className='m-4 flex w-full items-center gap-2 xl:min-w-0 xl:max-w-[600px] xl:flex-grow'>
						<Suspense>
							<SearchBar onSelect={handleSearchSelect} />
							<ListFilter
								className='shrink-0 cursor-pointer stroke-green'
								size={24}
							/>
						</Suspense>
					</div>
				)}

				{/* Menu desktop */}
				<nav className='hidden shrink-0 xl:flex xl:gap-4' aria-label='Menu principal'>
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className='whitespace-nowrap text-base text-white hover:underline'
						>
							{link.title}
						</Link>
					))}
				</nav>
			</div>

			{/* Menu mobile plein écran */}
			{isOpen && (
				<div className='fixed inset-0 z-50 flex flex-col bg-blue'>
					{/* Bouton de fermeture */}
					<div className='flex items-start justify-between p-4'>
						<button
							onClick={handleToggle}
							onKeyDown={handleClose}
							className='text-white'
							aria-label='Fermer le menu'
						>
							<X className='stroke-green' size={32} />
						</button>
					</div>

					{/* Logo centré */}
					<div className='mb-8 flex items-center justify-center'>
						<Image
							src={imgLogo}
							alt='logo'
							width={108}
							height={33}
							className='h-[33px] w-[108px]'
						/>
					</div>

					{/* Liens verticaux */}
					<div className='w-full space-y-4 bg-green px-6 py-4 text-xl font-bold text-darkgreen'>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className='group flex items-center justify-between pb-2'
							>
								<span className='underline decoration-dotted decoration-2 underline-offset-4 transition-all duration-300 group-hover:text-blue group-hover:decoration-blue group-hover:decoration-solid'>
									{link.title}
								</span>
								<span className='text-2xl'>→</span>
							</Link>
						))}
					</div>
				</div>
			)}
		</header>
	);
}
