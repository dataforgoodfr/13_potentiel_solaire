'use client';

import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

export interface InitialViewContextType {
	isInitialView: boolean;
	closeInitialView: () => void;
}

export const InitialViewContext = createContext<InitialViewContextType | undefined>(undefined);

//TODO: if useURLParams has values then don't show initial view
export const InitialViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isInitialView, setIsInitialView] = useState(true);

	const closeInitialView = useCallback(() => {
		setIsInitialView(false);
	}, []);

	return (
		<InitialViewContext.Provider value={{ isInitialView, closeInitialView }}>
			{children}
		</InitialViewContext.Provider>
	);
};

export function useInitialView() {
	const context = useContext(InitialViewContext);
	if (context === undefined) {
		throw new Error('useInitialView must be used with a InitialViewProvider');
	}
	return context;
}
