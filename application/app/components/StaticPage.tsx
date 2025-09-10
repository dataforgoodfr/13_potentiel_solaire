import { JSX } from 'react';

import Image from 'next/image';

import clsx from 'clsx';

export type StaticPageProps = {
	title: string;
	picture?: { src: string; alt: string; width: number };
	sections: {
		heading: string;
		paragraphs: Array<string | JSX.Element>;
	}[];
};

const StaticPage = ({ title, sections, picture }: StaticPageProps) => {
	console.log(!!picture);
	return (
		<article className={clsx('mx-auto max-w-3xl px-4 py-8', !!picture && 'max-w-6xl')}>
			<h1
				className='mb-4 text-[24px] font-bold leading-[28px] tracking-normal text-white'
				style={{ textDecoration: 'none' }}
			>
				{title}
			</h1>

			<div className={clsx('flex flex-col gap-4', !!picture && 'md:flex-row-reverse')}>
				{picture && (
					<div className='md:h-16 w-full rounded-sm md:w-1/2 mt-4'>
						<Image
							src={picture.src}
							alt={picture.alt}
							width={picture.width}
							height={190}
							style={{ borderRadius: '12px' }}
						/>
					</div>
				)}

				{sections.map((section, idx) => (
					<section key={idx} className={clsx('mb-6 w-full', !!picture && 'md:w-1/2')}>
						<h2
							className='mb-2 text-[16px] font-bold leading-normal tracking-[-0.03em] text-sol_ko'
							style={{ textDecoration: 'none' }}
						>
							{section.heading}
						</h2>
						{section.paragraphs.map((p, i) => (
							<p
								key={i}
								className='mb-2 text-[14px] font-normal leading-[28px] tracking-normal text-sol_ko'
								style={{ textDecoration: 'none' }}
							>
								{p}
							</p>
						))}
					</section>
				))}
			</div>
		</article>
	);
};

export default StaticPage;
