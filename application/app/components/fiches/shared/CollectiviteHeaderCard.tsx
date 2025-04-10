type CollectiviteHeaderCardProps = {
	type: 'commune' | 'departement' | 'region';
	nom: string;
};

export default function CollectiviteHeaderCard({ type, nom }: CollectiviteHeaderCardProps) {
	return (
		<div>
			<h1 className='text-xl font-bold text-blue'>{nom}</h1>
			<p className='capitalize text-grey'>{type}</p>
			<br />
		</div>
	);
}
