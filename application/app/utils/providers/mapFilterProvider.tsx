'use client';

import { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { TypeEtablissement } from '@/app/models/etablissements';

export type FilterState = Record<TypeEtablissement | 'All', boolean>;

const initialState: FilterState = {
	Lycée: true,
	Collège: true,
	Ecole: true,
	All: true,
};

const getNextState = (
	prevState: FilterState,
	[key, checked]: [keyof FilterState, boolean],
): FilterState => {
	if (key === 'All') {
		if (!checked) return prevState;
		return {
			Lycée: checked,
			Collège: checked,
			Ecole: checked,
			All: checked,
		};
	}
	const nextState = { ...prevState, [key]: checked };
	const allChecked = Object.values(nextState).every((value) => value === true);
	return { ...nextState, All: allChecked };
};

export interface MapFilterContextType {
	filterState: FilterState;
	setNextState: ([key, checked]: [keyof FilterState, boolean]) => void;
}

export const MapFilterContext = createContext<MapFilterContextType | undefined>(undefined);

export const MapFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [filterState, setFilterState] = useState(initialState);

	const setNextState = useCallback(
		([key, checked]: [keyof FilterState, boolean]) => {
			setFilterState(getNextState(filterState, [key, checked]));
		},
		[filterState, setFilterState],
	);

	return (
		<MapFilterContext.Provider value={{ filterState, setNextState }}>
			{children}
		</MapFilterContext.Provider>
	);
};

export function useMapFilter() {
	const context = useContext(MapFilterContext);
	if (context === undefined) {
		throw new Error('useMapFilter must be used with a MapFilterProvider');
	}
	return context;
}
