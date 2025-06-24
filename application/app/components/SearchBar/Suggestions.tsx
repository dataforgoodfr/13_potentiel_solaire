import { SearchResult } from '@/app/models/search';
import { CommandItem } from '@/components/ui/command';
import { MapPin, School } from 'lucide-react';

const SOURCE_TO_LABEL: Record<Exclude<SearchResult['source'], 'etablissements'>, string> = {
	communes: 'Commune',
	departements: 'Département',
	regions: 'Région',
};

function getIconFromResult(source: SearchResult['source']) {
	switch (source) {
		case 'communes':
		case 'departements':
		case 'regions':
			return <MapPin aria-hidden='true' focusable='false' />;
		case 'etablissements':
			return <School aria-hidden='true' focusable='false' />;
		default:
			throw new Error('Unexpected type - ' + source);
	}
}

type ResultsListProps = {
	items: SearchResult[];
	onSelect: (selection: SearchResult) => void;
};

export default function Suggestions({ items, onSelect }: ResultsListProps) {
	return (
		<div role='listbox' aria-label='Suggestions'>
			{items.map((item) => {
				const { id, libelle, source } = item;
				const icon = getIconFromResult(source);

				return (
					<CommandItem
						key={id}
						className='flex grow cursor-pointer'
						onSelect={() => onSelect(item)}
						role='option'
						tabIndex={0}
					>
						<div className='flex items-center gap-2'>
							{icon}
							<div>
								{libelle}{' '}
								{source === 'etablissements'
									? `(${item.extra_data.code_postal})`
									: `(${SOURCE_TO_LABEL[source]})`}
							</div>
						</div>
					</CommandItem>
				);
			})}
		</div>
	);
}
