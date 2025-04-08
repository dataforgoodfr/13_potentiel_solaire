import { useState } from 'react';

import { Etablissement } from '@/app/models/etablissements';
import { X } from 'lucide-react';

import FicheCommune from './ficheCommune';
import FicheEtablissement from './ficheEtablissement/ficheEtablissement';

type TabId = 'region' | 'departement' | 'commune' | 'etablissement';
type Tab = { id: TabId; label: string }[];

interface FichesProps {
	etablissement?: Etablissement;
	onClose: () => void;
}

export default function Fiches({ etablissement, onClose }: FichesProps) {
	const [activeTab, setActiveTab] = useState<TabId>('etablissement');

	if (!etablissement) return null;

	const tabs: Tab = [
		{ id: 'region', label: etablissement?.libelle_region || 'Région' },
		{ id: 'departement', label: etablissement?.libelle_departement || 'Département' },
		{ id: 'commune', label: etablissement?.nom_commune || 'Commune' },
		{ id: 'etablissement', label: etablissement?.nom_etablissement || 'Établissement' },
	];

	const commune = {
		code_commune: etablissement.code_commune,
		nom_commune: etablissement.nom_commune,
		code_departement: etablissement.code_departement,
		libelle_departement: etablissement.libelle_departement,
		code_region: etablissement.code_region,
		libelle_region: etablissement.libelle_region,
		surface_utile: etablissement.surface_utile ?? 0,
		potentiel_solaire: etablissement.potentiel_solaire ?? 0,
		count_etablissements: 0,
		count_etablissements_proteges: 0,
	};

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
				{activeTab === 'commune' && <FicheCommune commune={commune} />}
				{activeTab === 'etablissement' && (
					<FicheEtablissement feature={etablissement} onClose={onClose} />
				)}
			</div>
		</div>
	);
}
