'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { SearchResult } from '@/app/models/search';

type SearchContextType = {
	selection: SearchResult | null;
	setSelection: (selection: SearchResult | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
	const [selection, setSelection] = useState<SearchResult | null>(null);

	return (
		<SearchContext.Provider value={{ selection, setSelection }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error('useSearch must be used within a SearchProvider');
	}
	return context;
}
