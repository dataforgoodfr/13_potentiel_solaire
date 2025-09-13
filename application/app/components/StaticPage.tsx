<<<<<<< HEAD
import { ReactNode } from 'react';
=======
import { JSX, useState } from 'react';

import Image from 'next/image';

import clsx from 'clsx';
>>>>>>> 66009a1 (picture format and fallback + nation to pays)

export type StaticPageProps = {
	title: string;
	picture?: { src: string; alt: string; altSrc?: string; width: number };
	sections: {
		heading: string;
		paragraphs: (string | ReactNode)[];
	}[];
	media?: ReactNode;
};

<<<<<<< HEAD
<<<<<<< HEAD
const StaticPage = ({ title, sections, media }: StaticPageProps) => (
	<article className='mx-auto max-w-3xl px-4 py-8'>
		<h1 className='mb-4 text-lg font-bold leading-xl text-white'>{title}</h1>
		{media}
		{sections.map((section, idx) => (
			<section key={idx} className='mb-6'>
				<h2 className='mb-10 leading-normal'>{section.heading}</h2>
				{section.paragraphs.map((p, i) => (
					<p
						key={i}
						className='mb-6 text-sm leading-xl text-sol_ko'
						style={{ textDecoration: 'none' }}
					>
						{p}
					</p>
				))}
			</section>
		))}
=======
const StaticPage = ({ title, sections, picture }: StaticPageProps) => (
	<article className={clsx('mx-auto max-w-3xl px-4 py-8', !!picture && 'max-w-6xl px-8 md:px-4')}>
		<h1
			className='mb-4 text-[24px] font-bold leading-[28px] tracking-normal text-white'
			style={{ textDecoration: 'none' }}
=======
const StaticPage = ({ title, sections, picture }: StaticPageProps) => {
	const [imgSrc, setImgSrc] = useState<string | undefined>(picture?.alt);
	return (
		<article
			className={clsx('mx-auto max-w-3xl px-4 py-8', !!picture && 'max-w-6xl px-8 md:px-4')}
>>>>>>> 66009a1 (picture format and fallback + nation to pays)
		>
			<h1
				className='mb-4 text-[24px] font-bold leading-[28px] tracking-normal text-white'
				style={{ textDecoration: 'none' }}
			>
				{title}
			</h1>

			<div className={clsx('flex flex-col', !!picture && 'gap-12 md:flex-row-reverse')}>
				{picture && imgSrc && (
					<div className='mt-4 w-full rounded-sm md:h-16 md:w-1/2'>
						<Image
							src={imgSrc}
							alt={picture.alt}
							width={picture.width}
							height={190}
							style={{ borderRadius: '12px' }}
							className='w-full'
							onError={() => setImgSrc(picture.altSrc)}
						/>
					</div>
				)}

				{sections.map((section, idx) => (
					<section key={idx} className={clsx('mb-6 w-full', !!picture && 'md:w-1/2')}>
						<h2
							className='mb-2 text-[16px] font-bold leading-normal tracking-[-0.03em] text-sol_ko'
							style={{ textDecoration: 'none' }}
						>
<<<<<<< HEAD
							{p}
						</p>
					))}
				</section>
			))}
		</div>
>>>>>>> 4cb5a10 (wip greenpeace et data for good sections)
	</article>
);
=======
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
>>>>>>> 66009a1 (picture format and fallback + nation to pays)

export default StaticPage;
