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

function getExtraDataLibelle(result: SearchResult) {
	const { source } = result;
	switch (source) {
		case 'etablissements':
			return `(${result.extra_data.code_postal})`;
		case 'communes': {
			const codeDepartementWithoutLeadingZero = result.extra_data.code_departement.replace(
				/^0+/,
				'',
			);
			return `(${SOURCE_TO_LABEL[source]} - ${codeDepartementWithoutLeadingZero})`;
		}
		case 'departements':
		case 'regions':
			return `(${SOURCE_TO_LABEL[source]})`;
		default:
			throw new Error('Unexpected result - ' + result);
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
		const extraDataLibelle = getExtraDataLibelle(item);

		return (
			<CommandItem
				key={id}
				className='flex grow cursor-pointer'
				onSelect={() => onSelect(item)}
			>
				<div className='flex items-center gap-2'>
					{icon}
					<div>
						{libelle} {extraDataLibelle}
					</div>
				</div>
			</CommandItem>
		);
	});

	return commandItems;
}
