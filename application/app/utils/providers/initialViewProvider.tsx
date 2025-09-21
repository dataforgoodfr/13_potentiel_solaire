'use client';

import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import useURLParams from '../hooks/useURLParams';

export interface InitialViewContextType {
	isInitialView: boolean;
	closeInitialView: (searchTerm?: string) => void;
	searchTerm?: string;
}

export const InitialViewContext = createContext<InitialViewContextType | undefined>(undefined);

export const InitialViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { values } = useURLParams();
	const isAtLeastOnePlaceSelected = Object.values(values).some((code) => code !== null);
	const [isInitialView, setIsInitialView] = useState(!isAtLeastOnePlaceSelected);
	const [searchTerm, setSearchTerm] = useState('');

	const closeInitialView = useCallback((searchTerm: string = '') => {
		setIsInitialView(false);
		setSearchTerm(searchTerm);
	}, []);

	return (
		<InitialViewContext.Provider value={{ isInitialView, closeInitialView, searchTerm }}>
			{children}
		</InitialViewContext.Provider>
	);
};

export function useInitialView(): InitialViewContextType {
	const context = useContext(InitialViewContext);

	if (context === undefined) {
		throw new Error('useInitialView must be used with a InitialViewProvider');
	}

	return context;
}
