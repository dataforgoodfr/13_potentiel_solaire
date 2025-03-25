'use client';

import { useState } from 'react';

import { SearchResult } from '@/app/models/search';
import useDebouncedSearch from '@/app/utils/hooks/useSearch';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { CommandLoading } from 'cmdk';
import { MapPin, School, Search, X } from 'lucide-react';

const DEFAULT_EMPTY_RESULT_TEXT = 'Aucun résultat trouvé';
const DEFAULT_LOADING_TEXT = 'Recherche...';

const SOURCE_TO_LABEL: Record<Exclude<SearchResult['source'], 'etablissements'>, string> = {
	communes: 'Commune',
	departements: 'Département',
	regions: 'Région',
};

type SearchBarProps = {
	label: string;
	onSelect: (selection: SearchResult) => void;
	emptyResultText?: string;
	loadingText?: string;
};

export default function SearchBar({
	label,
	onSelect,
	emptyResultText = DEFAULT_EMPTY_RESULT_TEXT,
	loadingText = DEFAULT_LOADING_TEXT,
}: SearchBarProps) {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(true);

	const { items, isLoading } = useDebouncedSearch(query, query.length > 0);

	function handleQuery(query: string) {
		setQuery(query);
	}

	function handleSelect(selection: SearchResult) {
		setIsOpen(false);
		setQuery(selection.libelle);
		onSelect(selection);
	}

	function clearSearch() {
		handleQuery('');
		setIsOpen(false);
	}

	return (
		<div className='flex grow items-center space-x-6'>
			<div className='w-full'>
				<label className='mb-1 block text-sm font-medium text-gray-700'>{label}</label>
				<div className='relative'>
					<Search className='text-muted-foreground pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform' />
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverAnchor asChild>
							<Input
								className='rounded-sm pl-8 pr-8 outline-1 outline-blue-500'
								value={query}
								placeholder='Saisir le nom de votre commune'
								onChange={(e) => handleQuery(e.target.value)}
								onFocus={() => setIsOpen(true)}
								onBlur={() => setIsOpen(false)}
							/>
						</PopoverAnchor>
						{query.length > 0 && (
							<PopoverContent
								asChild={true}
								onOpenAutoFocus={(e) => e.preventDefault()}
								align='start'
								sideOffset={5}
							>
								<Command className='flex w-full px-8 shadow-xl'>
									{isLoading && <CommandLoading>{loadingText}</CommandLoading>}
									{!isLoading && items?.length === 0 && (
										<CommandEmpty className='text-muted-foreground text-center text-sm'>
											{emptyResultText}
										</CommandEmpty>
									)}
									<Suggestions items={items ?? []} onSelect={handleSelect} />
								</Command>
							</PopoverContent>
						)}
					</Popover>
					{query.length > 0 && (
						<button
							onClick={clearSearch}
							className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
							aria-label='Clear search'
						>
							<X size={16} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

function getIconFromResult(source: SearchResult['source']) {
	switch (source) {
		case 'communes':
		case 'departements':
		case 'regions':
			return <MapPin />;
		case 'etablissements':
			return <School />;

		default:
			throw new Error('Unexpected type - ' + source);
	}
}

type ResultsListProps = {
	items: SearchResult[];
	onSelect: (selection: SearchResult) => void;
};

function Suggestions({ items, onSelect }: ResultsListProps) {
	const commandItems = items.map((item) => {
		const { id, libelle, source } = item;
		const icon = getIconFromResult(source);

		return (
			<CommandItem
				key={id}
				className='flex grow cursor-pointer'
				onSelect={() => onSelect(item)}
			>
				<div className='flex grow'>
					<div className='size-5'>{icon}</div>
					<div className='fit grow gap-2'>
						{libelle}
						{source !== 'etablissements' && ` (${SOURCE_TO_LABEL[source]})`}
					</div>
				</div>
			</CommandItem>
		);
	});

	return (
		<CommandList className='grow'>
			<CommandGroup>{commandItems}</CommandGroup>
		</CommandList>
	);
}
