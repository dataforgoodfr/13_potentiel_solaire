'use client';

export default function GlobalError({ error }: { error: Error }) {
	return (
		<article className='mt-8 p-8 text-center text-white'>
			<h1 className='mb-8 text-2xl font-bold'>Erreur</h1>
			<p className='mb-4 text-sm'>
				Une erreur est survenue, veuillez réessayer ultérieurement.
			</p>
			{process.env.NODE_ENV === 'development' && (
				<section className='mb-4 mt-8'>
					<pre>{error.message}</pre>
				</section>
			)}
		</article>
	);
}
