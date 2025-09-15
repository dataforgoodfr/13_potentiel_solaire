import { ReactNode } from 'react';

export type StaticPageProps = {
	title: string;
	sections: {
		heading: string;
		paragraphs: (string | ReactNode)[];
	}[];
	media?: ReactNode;
};

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
	</article>
);

export default StaticPage;
