'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpCircle } from 'lucide-react';

import { footerDescription, footerLinks, footerText, partners } from './content/footer';

export default function Footer() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<footer className='z-footer fixed bottom-0 w-full bg-blue text-white' id='footer'>
			{/* Only show footer bar when drawer is closed */}
			{!isOpen && (
				<>
					<div className='flex w-full items-center justify-center border-t border-green bg-blue py-2'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							aria-expanded={isOpen}
							aria-controls='footer'
							className='flex cursor-pointer items-center gap-2'
						>
							<ArrowUpCircle
								className={`h-6 w-6 stroke-green transition-transform ${
									isOpen ? 'rotate-180' : ''
								}`}
							/>
							<span className='sr-only'>
								{isOpen ? 'Cacher le pied de page' : 'Afficher le pied de page'}
							</span>
						</button>
					</div>

					<div className='flex items-center justify-center gap-4 bg-blue py-2'>
						<h2 className='text-base font-bold'>{footerDescription.title}</h2>
					</div>
				</>
			)}

			{isOpen &&
				createPortal(
					<div className='z-footer-drawer fixed bottom-0 left-0 right-0 bg-blue text-white'>
						<div className='flex w-full items-center justify-center border-t border-green bg-blue py-2'>
							<button
								onClick={() => setIsOpen(!isOpen)}
								aria-expanded={isOpen}
								aria-controls='footer'
								className='flex cursor-pointer items-center gap-2'
							>
								<ArrowUpCircle
									className={`h-6 w-6 stroke-green transition-transform ${
										isOpen ? 'rotate-180' : ''
									}`}
								/>
								<span className='sr-only'>
									{isOpen ? 'Cacher le pied de page' : 'Afficher le pied de page'}
								</span>
							</button>
						</div>

						<div className='max-h-[75vh] overflow-y-auto bg-blue transition-all duration-500 ease-in-out'>
							<div className='mx-auto max-w-screen-xl px-6 pb-6 pt-4'>
								{/* Open view */}
								<div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
									<div className='text-center lg:max-w-xl lg:text-left'>
										<h2 className='text-base font-bold'>
											{footerDescription.title}
										</h2>
										<div className='mx-auto my-2 h-[1px] w-5 bg-green lg:mx-0'></div>
										<br />
										<p className='text-left text-sm leading-relaxed'>
											{footerDescription.text}
										</p>
									</div>
									<div className='flex flex-col items-center gap-4 lg:items-start'>
										<div className='flex items-center gap-4 bg-blue py-2'>
											<div className='flex flex-col items-center'>
												<Image
													src={partners[0].logo}
													alt={`Logo ${partners[0].name}`}
													width={35}
													height={35}
												/>
												<div className='mt-2 text-xs font-bold text-green'>
													{partners[0].name}
												</div>
												{partners[0].address && (
													<div className='mt-2 text-xs text-white'>
														{partners[0].address}
														<br />
														{partners[0].city}
														<br />
														{partners[0].phone}
													</div>
												)}
											</div>

											<div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-base italic text-blue lg:me-16 lg:ms-16'>
												ft.
											</div>

											<div className='flex flex-col items-center'>
												<Image
													src={partners[1].logo}
													alt={`Logo ${partners[1].name}`}
													width={35}
													height={35}
												/>
												<div className='mt-2 text-xs font-bold text-green'>
													{partners[1].name}
												</div>
												{partners[1].address && (
													<div className='mt-2 text-xs text-white'>
														{partners[1].address}
														<br />
														{partners[1].city}
														<br />
														{partners[1].phone}
													</div>
												)}
												{partners[1].socials && (
													<div className='mt-2 grid grid-cols-2 text-center gap-x-2 gap-y-0.5 text-xs text-green'>
														{partners[1].socials.map((social) => (
															<a
																key={social.name}
																href={social.href}
																target='_blank'
																rel='noopener noreferrer'
																aria-label={`${partners[1].name} sur ${social.name}`}
																className='hover:underline'
															>
																{social.name}
															</a>
														))}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className='mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-around'>
									<div className='text-center text-xs'>
										{footerText.copyright}
									</div>
									<nav aria-label='footer-links'>
										<ul className='flex flex-wrap justify-center gap-4'>
											{footerLinks.map((link) => (
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
					</div>,
					document.body,
				)}
		</footer>
	);
}
