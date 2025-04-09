import { Info } from 'lucide-react';

type Niveau = 'commune' | 'departement' | 'region';

const responsabilites = {
	commune: {
		principal: 'La commune est responsable des bâtiments des écoles primaires.',
		autres: 'Pour les collèges, choisissez la vue département et pour les lycées la vue région.',
	},
	departement: {
		principal: 'Le département est responsable des bâtiments des collèges.',
		autres: 'Pour les écoles élémentaires, choisissez la vue commune et pour les lycées la vue région.',
	},
	region: {
		principal: 'La région est responsable des bâtiments des lycées.',
		autres: 'Pour les écoles élémentaires, choisissez la vue commune et pour les collèges la vue département.',
	},
};

export default function ResponsabiliteMessage({ niveau }: { niveau: Niveau }) {
	const contenu = responsabilites[niveau];

	return (
		<div className='mb-4 flex gap-4 rounded-lg bg-gray-100 p-2'>
			<Info size={48} />
			<div>
				<p>{contenu.principal}</p>
				<p className='text-sm italic'>{contenu.autres}</p>
			</div>
		</div>
	);
}
