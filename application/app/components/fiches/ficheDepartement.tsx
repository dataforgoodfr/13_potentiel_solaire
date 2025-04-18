import { useState } from 'react';

import { Departement } from '@/app/models/departements';

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
	departement: Departement;
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
				<>
					<PotentielSolaireCard
						potentielSolaire={departement.potentiel_solaire_total}
						nbEtablissements={departement.nb_etablissements_total}
						nbEleves={departement.nb_eleves_total}
						niveau='etablissements'
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Établissements'
						repartition={departement.nb_etablissements_par_niveau_potentiel_total}
					/>
				</>
			) : (
				<>
					<PotentielSolaireCard
						potentielSolaire={departement.potentiel_solaire_colleges}
						nbEtablissements={departement.nb_etablissements_colleges}
						nbEleves={departement.nb_eleves_colleges}
						niveau='college'
						level='departement'
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Collèges'
						repartition={departement.nb_etablissements_par_niveau_potentiel_colleges}
					/>
				</>
			)}
			<hr className='my-4' />
			<TopCard topEtablissements={departement.top_etablissements_colleges} />
			<br />
			<AccordionCard />
		</div>
	);
}
