import { useState } from 'react';

import { CommuneProperties } from '@/app/models/communes';
import { DepartementProperties } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { RegionProperties } from '@/app/models/regions';
import { X } from 'lucide-react';

import FicheCommune from './FicheCommune';
import FicheDepartement from './FicheDepartement';
import FicheEtablissement from './ficheEtablissement/FicheEtablissement';
import FicheRegion from './FicheRegion';

type TabId = 'region' | 'departement' | 'commune' | 'etablissement';
type Tab = { id: TabId; label: string }[];

interface FichesProps {
	etablissement?: Etablissement;
	commune?: CommuneProperties;
	departement?: DepartementProperties;
	region?: RegionProperties;
	onClose: () => void;
}

export default function Fiches({
	etablissement,
	commune,
	departement,
	region,
	onClose,
}: FichesProps) {
	const [activeTab, setActiveTab] = useState<TabId>('etablissement');

	if (!etablissement) return null;

	const tabs: Tab = [
		{ id: 'region', label: etablissement?.libelle_region || 'Région' },
		{ id: 'departement', label: etablissement?.libelle_departement || 'Département' },
		{ id: 'commune', label: etablissement?.nom_commune || 'Commune' },
		{ id: 'etablissement', label: etablissement?.nom_etablissement || 'Établissement' },
	];

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
						className={`w-1/4 truncate rounded-md px-4 py-2 text-xs font-bold md:text-sm ${activeTab === tab.id ? 'bg-select font-bold text-green' : 'bg-green text-grey'}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='p-4'>
				{activeTab === 'region' && region && <FicheRegion region={region} />}
				{activeTab === 'departement' && departement && (
					<FicheDepartement departement={departement} />
				)}
				{activeTab === 'commune' && commune && <FicheCommune commune={commune} />}
				{activeTab === 'etablissement' && (
					<FicheEtablissement feature={etablissement} onClose={onClose} />
				)}
			</div>
		</div>
	);
}
