import { JSX, useState } from 'react';

import Image from 'next/image';

import clsx from 'clsx';

export type StaticPageProps = {
	title: string;
	picture?: { src: string; alt: string; altSrc?: string; width: number };
	sections: {
		heading: string;
		paragraphs: Array<string | JSX.Element>;
	}[];
};

const StaticPage = ({ title, sections, picture }: StaticPageProps) => {
	const [imgSrc, setImgSrc] = useState<string | undefined>(picture?.alt);
	return (
		<article
			className={clsx('mx-auto max-w-3xl px-4 py-8', !!picture && 'max-w-6xl px-8 md:px-4')}
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
