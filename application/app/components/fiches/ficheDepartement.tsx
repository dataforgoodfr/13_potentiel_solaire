import { useState } from 'react';

import { DepartementProperties } from '@/app/models/departements';

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
	{ id: 'managed', label: 'Collèges' },
];

type TabId = (typeof tabs)[number]['id'];

interface FicheDepartementProps {
	departement: DepartementProperties;
}

export default function FicheDepartement({ departement }: FicheDepartementProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<CollectiviteHeaderCard type='departement' nom={departement.libelle_departement} />
			<ActionButtons />
			<hr className='my-4' />
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='departement' />
			<br />
			{activeTab === 'all' ? (
				<PotentielSolaireCard
					potentiel_solaire={departement.potentiel_solaire_total}
					nb_etablissements={departement.nb_etablissements_total}
					nb_eleves={departement.nb_eleves_total}
					niveau='etablissements'
				/>
			) : (
				<PotentielSolaireCard
					potentiel_solaire={departement.potentiel_solaire_colleges}
					nb_etablissements={departement.nb_etablissements_colleges}
					nb_eleves={departement.nb_eleves_colleges}
					niveau='college'
					level='departements'
				/>
			)}
			<hr className='my-4' />
			<RepartitionPotentielSolaire
				niveau='Collèges'
				repartition={{
					eleve: departement.nb_etablissements_potentiel_eleve_colleges,
					bon: departement.nb_etablissements_potentiel_bon_colleges,
					bas: departement.nb_etablissements_potentiel_bas_colleges,
				}}
			/>
			<hr className='my-4' />
			<TopCard topEtablissements={departement.top_etablissements_colleges} />
			<br />
			<AccordionCard />
		</div>
	);
}
