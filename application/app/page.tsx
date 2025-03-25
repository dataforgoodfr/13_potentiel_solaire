'use client';

import MapWithLoader from './components/Map/MapWithLoader';
import SearchBar from './components/SearchBar/SearchBar';

export default function Home() {
	return (
		<div className='mx-auto flex max-w-screen-xl flex-col items-center justify-around'>
			<SearchBar
				onSelect={(selection) => alert(selection.libelle + ' - ' + selection.source)}
			/>
			<MapWithLoader />
		</div>
	);
}
