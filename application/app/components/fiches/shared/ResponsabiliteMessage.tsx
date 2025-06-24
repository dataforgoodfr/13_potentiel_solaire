import { Info } from 'lucide-react';

type Niveau = 'commune' | 'departement' | 'region';

const RESPONSABILITIES_TEXTS = {
	commune: {
		principal:
			'La commune est responsable des bâtiments des écoles primaires. Cliquez sur Tous pour voir tous les établissements scolaires confondus.',
		autres: "Pour les collèges, choisissez l'onglet département et pour les lycées l'onglet région.",
	},
	departement: {
		principal:
			'Le département est responsable des bâtiments des collèges. Cliquez sur Tous pour voir tous les établissements scolaires confondus.',
		autres: "Pour les écoles élémentaires, choisissez l'onglet commune et pour les lycées l'onglet région.",
	},
	region: {
		principal:
			'La région est responsable des bâtiments des lycées. Cliquez sur Tous pour voir tous les établissements scolaires confondus.',
		autres: "Pour les écoles élémentaires, choisissez l'onglet commune et pour les collèges l'onglet département.",
	},
};

export default function ResponsabiliteMessage({ niveau }: { niveau: Niveau }) {
	const contenu = RESPONSABILITIES_TEXTS[niveau];

	return (
		<div role='note' className='bg-gray-50 mb-4 flex gap-4 rounded-lg p-2 text-grey'>
			<Info size={72} aria-hidden='true' />
			<div>
				<p className='text-sm'>{contenu.principal}</p>
				<p className='text-xs italic'>{contenu.autres}</p>
			</div>
		</div>
	);
}
