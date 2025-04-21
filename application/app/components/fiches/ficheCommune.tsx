import { useState } from 'react';

import { Commune } from '@/app/models/communes';

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
	{ id: 'managed', label: 'Écoles primaires' },
];

type TabId = (typeof tabs)[number]['id'];

interface FicheCommuneProps {
	commune: Commune;
}

export default function FicheCommune({ commune }: FicheCommuneProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<CollectiviteHeaderCard type='commune' nom={commune.nom_commune} />
			<ActionButtons />
			<hr className='my-4' />
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='commune' />
			<br />
			{/* TODO: Les seuils des primaires ne sont pas encore établis */}
			{activeTab === 'all' ? (
				<>
					<PotentielSolaireCard
						potentielSolaire={commune.potentiel_solaire_total}
						potentielNbFoyers={commune.potentiel_nb_foyers_total}
						nbEleves={commune.nb_eleves_total}
						level='commune'
						header={
							<NbEtablissements
								nbEtablissements={commune.nb_etablissements_total}
								niveau='etablissements'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Établissements'
						repartition={commune.nb_etablissements_par_niveau_potentiel_total}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={commune.top_etablissements_total} />
				</>
			) : (
				<>
					<PotentielSolaireCard
						potentielSolaire={commune.potentiel_solaire_primaires}
						potentielNbFoyers={commune.potentiel_nb_foyers_primaires}
						nbEleves={commune.nb_eleves_primaires}
						header={
							<NbEtablissements
								nbEtablissements={commune.nb_etablissements_primaires}
								niveau='primaire'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Écoles'
						repartition={commune.nb_etablissements_par_niveau_potentiel_primaires}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={commune.top_etablissements_primaires} />
				</>
			)}
			<br />
			<AccordionCard />
		</div>
	);
}
