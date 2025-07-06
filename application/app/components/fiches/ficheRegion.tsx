import { useState } from 'react';

import { Region } from '@/app/models/regions';

import NbEtablissements from './NbEtablissements';
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
	region: Region;
}

export default function FicheRegion({ region }: FicheRegionProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<article aria-label={`Fiche de la région ${region.libelle_region}`}>
			<CollectiviteHeaderCard type='region' nom={region.libelle_region} />
			<hr className='mt-4 border-t-0' />
			<ActionButtons />
			<hr className='my-4' />

			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='region' />
			<br />
			{/* TODO: Les seuils des lycée ne sont pas encore établis */}
			{activeTab === 'all' ? (
				<>
					<PotentielSolaireCard
						potentielSolaire={region.potentiel_solaire_total}
						potentielNbFoyers={region.potentiel_nb_foyers_total}
						nbEleves={region.nb_eleves_total}
						level='region'
						header={
							<NbEtablissements
								nbEtablissements={region.nb_etablissements_total}
								niveau='etablissements'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Lycées'
						repartition={region.nb_etablissements_par_niveau_potentiel_total}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={region.top_etablissements_total} />
				</>
			) : (
				<>
					<PotentielSolaireCard
						potentielSolaire={region.potentiel_solaire_lycees}
						potentielNbFoyers={region.potentiel_nb_foyers_lycees}
						nbEleves={region.nb_eleves_lycees}
						header={
							<NbEtablissements
								nbEtablissements={region.nb_etablissements_lycees}
								niveau='lycee'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Lycées'
						repartition={region.nb_etablissements_par_niveau_potentiel_lycees}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={region.top_etablissements_lycees} />
				</>
			)}
			<br />
			<AccordionCard />
		</article>
	);
}
