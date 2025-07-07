import { useEffect, useState } from 'react';

import { Commune } from '@/app/models/communes';
import { Departement } from '@/app/models/departements';
import { Etablissement } from '@/app/models/etablissements';
import { Region } from '@/app/models/regions';
import useIsFicheOpen from '@/app/utils/hooks/useIsFicheOpen';
import useURLParams, { Codes } from '@/app/utils/hooks/useURLParams';
import { X } from 'lucide-react';

import FicheCommune from './ficheCommune';
import FicheDepartement from './ficheDepartement';
import FicheEtablissement from './ficheEtablissement/ficheEtablissement';
import FicheRegion from './ficheRegion';

type TabId = 'region' | 'departement' | 'commune' | 'etablissement';
type Tab = { id: TabId; label?: string }[];

interface FichesProps {
	etablissement?: Etablissement;
	commune?: Commune;
	departement?: Departement;
	region?: Region;
}

function getInitialTab(codes: Codes): TabId {
	if (codes.codeEtablissement !== null) return 'etablissement';
	if (codes.codeCommune !== null) return 'commune';
	if (codes.codeDepartement !== null) return 'departement';
	if (codes.codeRegion !== null) return 'region';

	throw new Error(`Codes ${codes} is not supported to get initial tab`);
}

export default function Fiches({ etablissement, commune, departement, region }: FichesProps) {
	const { values } = useURLParams();
	const [activeTab, setActiveTab] = useState<TabId>(getInitialTab(values));
	const [, setIsFicheOpen] = useIsFicheOpen();
	// Update activeTab when values change
	//FIXME: when clicking from a topcard and the url does not change, the active tab can't be updated -> use activeTab queryParam instead of isOpen
	useEffect(() => {
		setActiveTab(getInitialTab(values));
	}, [values]);

	function handleClose() {
		setIsFicheOpen(false);
	}

	const tabs: Tab = [
		{ id: 'region', label: region?.libelle_region },
		{ id: 'departement', label: departement?.libelle_departement },
		{ id: 'commune', label: commune?.nom_commune },
		{ id: 'etablissement', label: etablissement?.nom_etablissement },
	];

	const filteredTabs = tabs.filter((tab) => tab.label !== undefined);

	return (
		<div
			className={`fixed right-0 top-0 z-50 h-full w-full animate-slide-in-bottom overflow-y-auto bg-white pl-5 pt-1 shadow-lg md:m-4 md:h-[calc(100%-2rem)] md:w-2/5 md:max-w-[450px] md:animate-slide-in-right md:rounded-md`}
		>
			<button
				onClick={handleClose}
				className='absolute left-1 top-2 text-xl text-grey hover:text-black'
			>
				<X />
			</button>
			<div className='flex gap-1 pl-2'>
				{filteredTabs.map((tab) => (
					<button
						key={tab.id}
						className={`truncate rounded-md px-4 py-2 text-xs font-bold md:text-sm ${activeTab === tab.id ? 'bg-blue font-bold text-green' : 'bg-green text-blue'}`}
						style={{ flexBasis: `${(1 / filteredTabs.length) * 100}%` }}
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
				{activeTab === 'etablissement' && etablissement && (
					<FicheEtablissement etablissement={etablissement} />
				)}
			</div>
		</div>
	);
}
