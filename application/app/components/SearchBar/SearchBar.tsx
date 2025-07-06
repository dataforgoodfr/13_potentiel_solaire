'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { SearchResult } from '@/app/models/search';
import useCommune from '@/app/utils/hooks/useCommune';
import useDebouncedSearch from '@/app/utils/hooks/useDebouncedSearch';
import useDepartement from '@/app/utils/hooks/useDepartement';
import useEtablissement from '@/app/utils/hooks/useEtablissement';
import useRegion from '@/app/utils/hooks/useRegion';
import useURLParams from '@/app/utils/hooks/useURLParams';
import { Command, CommandEmpty, CommandGroup, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { CommandInput, CommandLoading } from 'cmdk';
import { Search, X } from 'lucide-react';

import GeolocButton from '../GeolocButton';
import Loading from '../Loading';
import Suggestions from './Suggestions';

const DEFAULT_PLACEHOLDER = 'Entrez une ville, un établissement...';
const DEFAULT_EMPTY_RESULT_TEXT = 'Aucun résultat trouvé';

type SearchBarProps = {
	onSelect?: () => void;
};

export default function SearchBar({ onSelect }: SearchBarProps) {
	const [query, setQuery] = useState('');
	const { items, isLoading } = useDebouncedSearch(query);

	const [selection, setSelection] = useState<SearchResult | null>(null);

	useChangeCodesOnSelection(selection, onSelect);

	async function handleSelect(selection: SearchResult) {
		setQuery(selection.libelle);
		setSelection(selection);
	}

	function clearSearch() {
		setQuery('');
		setSelection(null);
	}

	return (
		<Autocomplete
			inputValue={query}
			onInputChange={setQuery}
			options={items}
			loading={isLoading}
			onSelect={handleSelect}
			onClear={clearSearch}
		/>
	);
}

function useChangeCodesOnSelection(selection: SearchResult | null, onChange?: () => void) {
	const { setCodes } = useURLParams();
	const { region } = useRegion(selection?.source === 'regions' ? selection?.id : null);
	const { departement } = useDepartement(
		selection?.source === 'departements' ? selection?.id : null,
	);
	const { commune } = useCommune(selection?.source === 'communes' ? selection?.id : null);
	const { etablissement } = useEtablissement(
		selection?.source === 'etablissements' ? selection?.id : null,
	);

	useEffect(() => {
		if (region != null) {
			setCodes(
				{
					codeRegion: region.code_region,
					codeDepartement: null,
					codeCommune: null,
					codeEtablissement: null,
				},
				true,
			);
			onChange?.();
		}
		if (departement != null) {
			setCodes(
				{
					codeRegion: departement.code_region,
					codeDepartement: departement.code_departement,
					codeCommune: null,
					codeEtablissement: null,
				},
				true,
			);
			onChange?.();
		}
		if (commune != null) {
			setCodes(
				{
					codeRegion: commune.code_region,
					codeDepartement: commune.code_departement,
					codeCommune: commune.code_commune,
					codeEtablissement: null,
				},
				true,
			);
			onChange?.();
		}
		if (etablissement != null) {
			setCodes(
				{
					codeRegion: etablissement.code_region,
					codeDepartement: etablissement.code_departement,
					codeCommune: etablissement.code_commune,
					codeEtablissement: etablissement.identifiant_de_l_etablissement,
				},
				true,
			);
			onChange?.();
		}
	}, [commune, departement, etablissement, onChange, region, setCodes]);
}

type AutocompleteProps = {
	inputValue: string;
	options: SearchResult[] | undefined;
	onInputChange: (v: string) => void;
	onSelect: (option: SearchResult) => void;
	onClear?: () => void;
	placeholder?: string;
	noOptionsText?: string;
	loadingText?: string;
	loading?: boolean;
	openSuggestionsAtInputLength?: number;
};

// Inspired from: https://github.com/shadcn-ui/ui/issues/1069
export function Autocomplete({
	inputValue,
	options,
	onInputChange,
	onSelect,
	onClear,
	loading = false,
	placeholder = DEFAULT_PLACEHOLDER,
	noOptionsText = DEFAULT_EMPTY_RESULT_TEXT,
	openSuggestionsAtInputLength = 1,
}: AutocompleteProps) {
	/**
	 * Hidden `CommandInput` ref to relay keydown events to the command list.
	 */
	const cmdInputRef = useRef<HTMLInputElement>(null);
	/**
	 * Actual form input ref.
	 */
	const inputRef = useRef<HTMLInputElement>(null);

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	function onInputValueChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		onInputChange(value);
		if (!isPopoverOpen && value.length >= openSuggestionsAtInputLength) {
			setIsPopoverOpen(true);
		} else if (isPopoverOpen && value.length < openSuggestionsAtInputLength) {
			setIsPopoverOpen(false);
		}
	}

	/**
	 * Pass all keydown events from the input to the `CommandInput` to provide navigation using up/down arrow keys etc.
	 */
	function relayInputKeyDownToCommand(e: React.KeyboardEvent<HTMLInputElement>) {
		const { key, code, bubbles } = e;
		cmdInputRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles }));

		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
		}
	}

	function handleClear() {
		setIsPopoverOpen(false);
		inputRef.current?.focus();
		onClear?.();
	}

	return (
		<div className='w-full max-w-screen-sm text-white'>
			<div className='relative w-full'>
				<Search className='pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
				<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<PopoverAnchor>
						<Input
							ref={inputRef}
							value={inputValue}
							placeholder={placeholder}
							onKeyDown={relayInputKeyDownToCommand}
							onChange={onInputValueChange}
							className='pl-8 pr-16 placeholder:truncate'
							aria-label='Recherche par ville ou établissement'
							aria-autocomplete='list'
							aria-controls='search-results-list'
							aria-expanded={isPopoverOpen}
						/>
					</PopoverAnchor>
					<PopoverContent
						onOpenAutoFocus={(e) => e.preventDefault()}
						className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-1'
					>
						<Command shouldFilter={false} loop role='listbox' id='search-results-list'>
							<CommandInput ref={cmdInputRef} value={inputValue} className='hidden' />
							<CommandList>
								{loading && (
									<CommandLoading>
										<Loading />
									</CommandLoading>
								)}
								<CommandEmpty className='p-2'>{noOptionsText}</CommandEmpty>
								{options && options.length > 0 && (
									<CommandGroup>
										<Suggestions items={options ?? []} onSelect={onSelect} />
									</CommandGroup>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				{inputValue.length > 0 && (
					<button
						type='button'
						onClick={handleClear}
						className='text-gray-400 hover:text-gray-600 absolute right-8 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center'
						aria-label='Clear search'
					>
						<X size={16} />
					</button>
				)}
				<div className='absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2'>
					<GeolocButton />
				</div>
			</div>
		</div>
	);
}
