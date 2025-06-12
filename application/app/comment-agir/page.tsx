import { commentAgirTexts } from '../components/content/commentAgir';

export default function Home() {
	return (
		<div className='container mx-auto text-white'>
			<div className='px-5'>
				<h1 className='text-2xl font-bold'>{commentAgirTexts.mainTitle}</h1>
				<h2 className='text-lg font-bold'>{commentAgirTexts.subtitle}</h2>
				<p className='text-sm'>{commentAgirTexts.text}</p>
			</div>
		</div>
	);
}
