import SearchBar from '@/app/components/SearchBar/SearchBar';
import { useInitialView } from '@/app/utils/providers/initialViewProvider';

export default function HomeOverlay() {
	const { isInitialView, closeInitialView } = useInitialView();

	if (!isInitialView) return null;

	return (
		<div className='z-home-overlay absolute inset-0 flex h-full w-full flex-col items-center justify-start bg-blue/80 p-4'>
			<div className='w-full max-w-screen-xl pb-6 pt-0 md:pt-4'>
				<h1 className='mb-24 inline-block font-verdana text-[28px] font-normal leading-normal tracking-sm text-slate-100 lg:ms-24 lg:self-start'>
					Découvrez le
					<br />
					<strong>potentiel solaire</strong> 🔆
					<br />
					de votre <strong>école</strong> 🏫
				</h1>

				<div className='flex w-full justify-center py-4'>
					<div className='flex max-w-[434px] shrink-1 flex-col items-center justify-center rounded-[8px] border border-green bg-blue/80 py-[30px] shadow-base'>
						<div className='px-3'>
							<h2 className='mb-4 text-base font-normal leading-6 text-white'>
								Saisir une région, un département, une commune ou le nom d&#39;un
								établissement :
							</h2>
							<SearchBar onSelect={closeInitialView} />
						</div>
						<hr className='my-5 h-[1px] w-full border-green' />
						<div className='flex items-center justify-center'>
							<button
								className='rounded-md bg-green px-4 py-2 text-sm font-bold leading-6 text-darkgreen'
								onClick={closeInitialView}
							>
								Je préfère utiliser la carte
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
