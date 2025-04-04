'use client';

import Map from './components/Map/Map';
import SearchBar from './components/SearchBar/SearchBar';
import { SearchResult } from './models/search';

export default function Home() {
	function handleSearchSelect(selection: SearchResult) {
		alert(selection.libelle + ' - ' + selection.source);
	}

	return (
		<div className='mx-auto flex max-w-screen-xl flex-col items-center justify-around'>
			<SearchBar onSelect={handleSearchSelect} />
			<Map />
		</div>
	);
}
