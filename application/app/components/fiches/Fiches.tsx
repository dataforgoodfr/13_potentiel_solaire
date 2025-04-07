import { useState } from 'react';

import { Etablissement } from '@/app/models/etablissements';
import { X } from 'lucide-react';

import FicheEtablissement from './ficheEtablissement/ficheEtablissement';

type TabId = 'region' | 'departement' | 'commune' | 'etablissement';
type Tab = { id: TabId; label: string }[];

const tabs: Tab = [
	{ id: 'region', label: 'Région' },
	{ id: 'departement', label: 'Département' },
	{ id: 'commune', label: 'Commune' },
	{ id: 'etablissement', label: 'Établissement' },
];

interface FichesProps {
	etablissement?: Etablissement;
	onClose: () => void;
}

export default function Fiches({ etablissement, onClose }: FichesProps) {
	const [activeTab, setActiveTab] = useState<TabId>('etablissement');

	if (!etablissement) return null;

	return (
		<div className='fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-white pl-5 pt-1 shadow-lg md:w-96'>
			<button
				onClick={onClose}
				className='absolute left-1 top-4 text-xl text-gray-500 hover:text-black'
			>
				<X />
			</button>

			<div className='flex border-b pl-2'>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`w-1/4 truncate rounded-md px-4 py-2 text-sm md:text-base ${activeTab === tab.id ? 'bg-gray-500 font-bold text-green' : 'bg-green text-gray-500'}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='p-4'>
				{activeTab === 'region' && <div>Contenu onglet région</div>}
				{activeTab === 'departement' && <div>Contenu onglet département</div>}
				{activeTab === 'commune' && <div>Contenu onglet commune</div>}
				{activeTab === 'etablissement' && (
					<FicheEtablissement feature={etablissement} onClose={onClose} />
				)}
			</div>
		</div>
	);
}
