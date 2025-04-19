'use client';

import * as React from 'react';

import { FilterState, useMapFilter } from '@/app/utils/providers/mapFilterProvider';
import { Button } from '@/components/ui/button';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { ListFilter } from 'lucide-react';

interface FiltersProps {}

const FILTERS_LABEL: Record<keyof FilterState, string> = {
	Lycée: 'Lycées',
	Collège: 'Collèges',
	Ecole: 'Écoles',
	All: 'Tous',
};

const Filters: React.FC<FiltersProps> = () => {
	const { filterState, setNextState } = useMapFilter();

	function onCheckedChange(key: keyof FilterState, checked: boolean) {
		setNextState([key, checked]);
	}

	const stateArrayWithoutAll = Object.entries(filterState).filter(([key]) => key !== 'All');
	const allChecked = stateArrayWithoutAll.every(([, value]) => value === true);
	const lastChecked = stateArrayWithoutAll.filter(([, value]) => value === true).length === 1;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{/* TODO: add proper colors */}
				<Button variant='ghost' className='bg-inherit hover:bg-black'>
					<ListFilter className='shrink-0 stroke-green' size={24} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56 rounded-sm border-2 border-white bg-blue text-white'>
				{(Object.keys(filterState) as (keyof FilterState)[]).map((key) => (
					<DropdownMenuCheckboxItem
						className='cursor-pointer rounded-none'
						key={key}
						checked={filterState[key]}
						onCheckedChange={onCheckedChange.bind(null, key)}
						onSelect={(e) => e.preventDefault()}
						disabled={
							(key === 'All' && allChecked) ||
							(key !== 'All' && lastChecked && filterState[key] === true)
						}
					>
						{FILTERS_LABEL[key]}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Filters;
