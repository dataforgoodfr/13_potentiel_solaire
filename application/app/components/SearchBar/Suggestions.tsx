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

export default function Suggestions({ items, onSelect }: ResultsListProps) {
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
						{libelle}{' '}
						{source === 'etablissements'
							? `(${item.extra_data.code_postal})`
							: `(${SOURCE_TO_LABEL[source]})`}
					</div>
				</div>
			</CommandItem>
		);
	});

	return commandItems;
}
