'use client';

import { ReactNode, createContext, useCallback, useState } from 'react';

export interface InitialViewContextType {
	isInitialView: boolean;
	closeInitialView: () => void;
}

export const InitialViewContext = createContext<InitialViewContextType | null>(null);

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
