type CollectiviteHeaderCardProps = {
	type: 'commune' | 'departement' | 'region';
	nom: string;
};

const labels: Record<CollectiviteHeaderCardProps['type'], string> = {
	commune: 'Commune',
	departement: 'Département',
	region: 'Région',
};

export default function CollectiviteHeaderCard({ type, nom }: CollectiviteHeaderCardProps) {
	return (
		<div className='space-y-1'>
			<h1 className='text-xl font-bold text-blue'>{nom}</h1>
			<p className='text-grey'>{labels[type]}</p>
		</div>
	);
}
