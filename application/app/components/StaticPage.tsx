export type StaticPageProps = {
	title: string;
	sections: {
		heading: string;
		paragraphs: string[];
	}[];
};

const StaticPage = ({ title, sections }: StaticPageProps) => (
	<article className='mx-auto max-w-3xl px-4 py-8'>
		<h1 className='text-decoration: none mb-4 text-[24px] font-bold leading-[28px] tracking-normal text-white'>
			{title}
		</h1>
		{sections.map((section, idx) => (
			<section key={idx} className='mb-6'>
				<h2 className='text-decoration: none mb-2 text-[16px] font-bold leading-normal tracking-[-0.03em] text-sol_ko'>
					{section.heading}
				</h2>
				{section.paragraphs.map((p, i) => (
					<p
						key={i}
						className='text-decoration: none mb-2 text-[14px] font-normal leading-[28px] tracking-normal text-sol_ko'
					>
						{p}
					</p>
				))}
			</section>
		))}
	</article>
);

export default StaticPage;
