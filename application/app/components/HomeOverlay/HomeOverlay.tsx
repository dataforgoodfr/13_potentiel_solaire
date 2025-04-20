import SearchBar from '@/app/components/SearchBar/SearchBar';
import { SearchResult } from '@/app/models/search';

interface HomeOverlayProps {
	onUseMap: () => void;
}

export const HomeOverlay: React.FC<HomeOverlayProps> = ({ onUseMap }: HomeOverlayProps) => {
	//TODO: update in Issue #157
	const handleSearchSelect = (selection: SearchResult) => {
		alert(selection.libelle + ' - ' + selection.source);
	};

	return (
		<div className='bg-blue/80 absolute inset-0 z-40 flex h-full w-full flex-col items-center justify-start p-4'>
			{/* TODO: text color should be Gray-6 */}
			<h1 className='mb-24 inline-block font-verdana text-[28px] font-normal leading-normal tracking-sm text-slate-100 lg:ms-24 lg:self-start'>
				Découvrez le
				<br />
				<strong>potentiel solaire</strong> 🔆
				<br />
				de votre <strong>école</strong> 🏫
			</h1>
			<div className='border-light-green bg-blue/80 flex max-w-[434px] shrink-0 flex-col items-center justify-center rounded-[8px] border py-[30px] shadow-base'>
				<div className='px-3'>
					<h2 className='mb-4 text-base font-normal leading-6 text-white'>
						Saisir une région, un département, une commune ou le nom d&#39;un
						établissement :
					</h2>
					<SearchBar onSelect={handleSearchSelect} />
				</div>
				<hr className='border-light-green my-5 h-[1px] w-full' />
				<div className='flex items-center justify-center'>
					<button
						className='bg-light-green rounded-md px-4 py-2 text-sm font-bold leading-6 text-darkgreen'
						onClick={onUseMap}
					>
						Je préfère utiliser la carte
					</button>
				</div>
			</div>
		</div>
	);
};

export default HomeOverlay;
