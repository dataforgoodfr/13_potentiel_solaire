import { useState } from 'react';

import { RegionProperties } from '@/app/models/regions';

import AccordionCard from './shared/AccordionCard';
import ActionButtons from './shared/ActionButtons';
import CollectiviteHeaderCard from './shared/CollectiviteHeaderCard';
import PotentielSolaireCard from './shared/PotentielSolaireCard';
import RepartitionPotentielSolaire from './shared/RepartitionPotentielSolaire';
import ResponsabiliteMessage from './shared/ResponsabiliteMessage';
import Tabs from './shared/Tabs';
import TopCard from './shared/TopCard';

const tabs = [
	{ id: 'all', label: 'Tous' },
	{ id: 'managed', label: 'Lycées' },
];

type TabId = (typeof tabs)[number]['id'];

interface FicheRegionProps {
	region: RegionProperties;
}

export default function FicheRegion({ region }: FicheRegionProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<CollectiviteHeaderCard type='region' nom={region.libelle_region} />
			<ActionButtons />
			<hr className='my-4' />

			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='region' />
			<br />
			{activeTab === 'all' ? (
				<PotentielSolaireCard
					potentiel_solaire={region.potentiel_solaire_total}
					nb_etablissements={region.nb_etablissements_total}
					nb_eleves={region.nb_eleves_total}
					niveau='etablissements'
				/>
			) : (
				<PotentielSolaireCard
					potentiel_solaire={region.potentiel_solaire_lycees}
					nb_etablissements={region.nb_etablissements_lycees}
					nb_eleves={region.nb_eleves_lycees}
					niveau='lycee'
					level='regions'
				/>
			)}

			<hr className='my-4' />
			<RepartitionPotentielSolaire
				niveau='Lycées'
				repartition={{
					eleve: region.nb_etablissements_potentiel_eleve_lycees,
					bon: region.nb_etablissements_potentiel_bon_lycees,
					bas: region.nb_etablissements_potentiel_bas_lycees,
				}}
			/>
			<hr className='my-4' />
			<TopCard topEtablissements={region.top_etablissements_lycees} />
			<br />
			<AccordionCard />
		</div>
	);
}
