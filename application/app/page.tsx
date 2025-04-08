'use client';

import MapWithFiches from './components/Map/MapWithFiches';
import SearchBar from './components/SearchBar/SearchBar';
import { SearchResult } from './models/search';

export default function Home() {
	function handleSearchSelect(selection: SearchResult) {
		alert(selection.libelle + ' - ' + selection.source);
	}

	return (
		<div className='flex h-screen flex-col'>
			<div className='p-4'>
				<SearchBar onSelect={handleSearchSelect} />
			</div>
			<div className='flex-1'>
				<MapWithFiches />
			</div>
		</div>
	);
}
