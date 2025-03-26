'use client';

import { useState } from 'react';

import { SearchResult } from '@/app/models/search';
import useDebouncedSearch from '@/app/utils/hooks/useDebouncedSearch';
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

const DEFAULT_PLACEHOLDER = 'Entrez une ville, un établissement...';
const DEFAULT_EMPTY_RESULT_TEXT = 'Aucun résultat trouvé';
const DEFAULT_LOADING_TEXT = 'Recherche...';

const SOURCE_TO_LABEL: Record<Exclude<SearchResult['source'], 'etablissements'>, string> = {
	communes: 'Commune',
	departements: 'Département',
	regions: 'Région',
};

type SearchBarProps = {
	onSelect: (selection: SearchResult) => void;
	placeholder?: string;
	emptyResultText?: string;
	loadingText?: string;
};

export default function SearchBar({
	onSelect,
	placeholder = DEFAULT_PLACEHOLDER,
	emptyResultText = DEFAULT_EMPTY_RESULT_TEXT,
	loadingText = DEFAULT_LOADING_TEXT,
}: SearchBarProps) {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(true);

	const { items, isLoading } = useDebouncedSearch(query);

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
		<div className='mg-x m-4 w-full max-w-screen-sm'>
			<div className='relative w-full'>
				{!isOpen && (
					<Search className='pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
				)}
				<Popover open={isOpen} /*  onOpenChange={setIsOpen} */>
					<PopoverAnchor asChild>
						<Input
							className='pl-8 pr-8'
							style={{ paddingLeft: isOpen ? 8 : 32 }}
							value={query}
							placeholder={placeholder}
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
							<Command className='flex w-full max-w-screen-sm p-0 shadow-xl'>
								{isLoading && <CommandLoading>{loadingText}</CommandLoading>}
								{!isLoading && items?.length === 0 && (
									<CommandEmpty className='p-2 text-center text-sm text-muted-foreground'>
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
				<div className='flex items-center gap-2'>
					{icon}
					<div>
						{libelle}
						{source !== 'etablissements' && ` (${SOURCE_TO_LABEL[source]})`}
					</div>
				</div>
			</CommandItem>
		);
	});

	return (
		<CommandList>
			<CommandGroup>{commandItems}</CommandGroup>
		</CommandList>
	);
}
