import { ReactNode } from 'react';

export type StaticPageProps = {
	title: string;
	sections: {
		id?: string;
		heading?: string;
		paragraphs: (string | ReactNode)[];
	}[];
	media?: ReactNode;
};

const StaticPage = ({ title, sections, media }: StaticPageProps) => (
	<article className='mx-auto max-w-3xl px-4 py-8'>
		<h1 className='leading-xl mb-4 mt-8 text-[3rem] font-bold text-white'>{title}</h1>
		{media}
		{sections.map((section, idx) => (
			<section key={idx} className='mb-6'>
				{section.heading && (
					<h2
						className='mb-3 mt-6 text-[2.5rem] font-bold leading-normal text-sol_ko'
						id={section.id}
					>
						{section.heading}
					</h2>
				)}
				{section.paragraphs.map((p, i) => (
					<p
						key={i}
						className='leading-xl mb-6 text-base text-sol_ko'
						style={{ textDecoration: 'none' }}
					>
						{p}
					</p>
				))}
			</section>
		))}
	</article>
);

export default StaticPage;
