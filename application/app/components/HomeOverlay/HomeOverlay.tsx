import SearchBar from '@/app/components/SearchBar/SearchBar';
import { useInitialView } from '@/app/utils/providers/initialViewProvider';

export default function HomeOverlay() {
	const { isInitialView, closeInitialView } = useInitialView();

	if (!isInitialView) return null;

	return (
		<div className='absolute inset-0 z-home-overlay flex h-full w-full flex-col items-center justify-start bg-blue/80 px-4 pb-16 pt-4 sm:pb-4'>
			<div className='w-full max-w-screen-xl pb-20 pt-0 sm:pb-6 md:pt-4'>
				<h1
					className='font-verdana tracking-sm mb-12 inline-block text-[28px] font-normal leading-normal text-slate-100 sm:mb-24 lg:ms-24 lg:self-start'
					aria-label='Découvrez le potentiel solaire de votre école'
				>
					Découvrez le
					<br />
					<strong>potentiel solaire</strong> 🔆
					<br />
					de votre <strong>école</strong> 🏫
				</h1>

				<div className='flex w-full justify-center py-4'>
					<div className='shrink-1 flex max-w-[434px] flex-col items-center justify-center rounded-[8px] border border-green bg-blue/80 py-[15px] shadow-base sm:py-[30px]'>
						<div className='px-[15px]'>
							<h2 className='mb-4 text-base font-normal leading-6 text-white'>
								Saisir une région, un département, une commune ou le nom d&#39;un
								établissement :
							</h2>
							<SearchBar onSelect={closeInitialView} />
						</div>
						<hr className='my-5 h-[1px] w-full border-green' />
						<div className='flex items-center justify-center px-[15px]'>
							<button
								className='rounded-md bg-green px-4 py-2 text-sm font-bold leading-6 text-darkgreen'
								onClick={() => closeInitialView()}
                aria-label='Fermer la fenêtre de recherche et utiliser la carte'
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
