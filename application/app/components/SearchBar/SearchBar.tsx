'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { CommunePropertiesKeys } from '@/app/models/communes';
import { DepartementPropertiesKeys } from '@/app/models/departements';
import { EtablissementPropertiesKeys } from '@/app/models/etablissements';
import { RegionPropertiesKeys } from '@/app/models/regions';
import { SearchPropertiesKeys, SearchResult } from '@/app/models/search';
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
	const { region } = useRegion(
		selection?.[SearchPropertiesKeys.Source] === 'regions'
			? selection?.[SearchPropertiesKeys.Id]
			: null,
	);
	const { departement } = useDepartement(
		selection?.[SearchPropertiesKeys.Source] === 'departements'
			? selection?.[SearchPropertiesKeys.Id]
			: null,
	);
	const { commune } = useCommune(
		selection?.[SearchPropertiesKeys.Source] === 'communes'
			? selection?.[SearchPropertiesKeys.Id]
			: null,
	);
	const { etablissement } = useEtablissement(
		selection?.[SearchPropertiesKeys.Source] === 'etablissements'
			? selection?.[SearchPropertiesKeys.Id]
			: null,
	);

	useEffect(() => {
		if (region != null) {
			setCodes(
				{
					codeRegion: region[RegionPropertiesKeys.Id],
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
					codeRegion: departement[DepartementPropertiesKeys.CodeRegion],
					codeDepartement: departement[DepartementPropertiesKeys.Id],
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
					codeRegion: commune[CommunePropertiesKeys.CodeRegion],
					codeDepartement: commune[CommunePropertiesKeys.CodeDepartement],
					codeCommune: commune[CommunePropertiesKeys.Id],
					codeEtablissement: null,
				},
				true,
			);
			onChange?.();
		}
		if (etablissement != null) {
			setCodes(
				{
					codeRegion: etablissement[EtablissementPropertiesKeys.CodeRegion],
					codeDepartement: etablissement[EtablissementPropertiesKeys.CodeDepartement],
					codeCommune: etablissement[EtablissementPropertiesKeys.CodeCommune],
					codeEtablissement: etablissement[EtablissementPropertiesKeys.Id],
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
	const cmdInputRef = useRef<HTMLInputElement>(null);

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	function onInputValueChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		onInputChange(value);
		if (!isPopoverOpen && value.length >= openSuggestionsAtInputLength) {
			setIsPopoverOpen(true);
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
		onClear?.();
	}

	return (
		<div className='w-full max-w-screen-sm text-white'>
			<div className='relative w-full'>
				<Search className='pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
				<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<PopoverAnchor>
						<Input
							value={inputValue}
							placeholder={placeholder}
							onKeyDown={relayInputKeyDownToCommand}
							onChange={onInputValueChange}
							onClick={() => setIsPopoverOpen(true)}
							className='pl-8 pr-16 placeholder:truncate'
						/>
					</PopoverAnchor>
					<PopoverContent
						onOpenAutoFocus={(e) => e.preventDefault()}
						className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-1'
					>
						<Command shouldFilter={false} loop>
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
