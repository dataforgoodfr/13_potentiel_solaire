import { useState } from 'react';

import { Departement } from '@/app/models/departements';

import { COLOR_THRESHOLDS, COLOR_THRESHOLDS_BY_TYPE_ETABLISSEMENT } from '../Map/constants';
import NbEtablissements from './shared/NbEtablissements';
import ActionButtons from './shared/ActionButtons';
import CollectiviteHeaderCard from './shared/CollectiviteHeaderCard';
import PotentielSolaireCard from './shared/PotentielSolaireCard';
import RepartitionPotentielSolaire from './shared/RepartitionPotentielSolaire';
import ResponsabiliteMessage from './shared/ResponsabiliteMessage';
import Tabs from './shared/Tabs';
import TopCard from './shared/TopCard';

const tabs = [
	{ id: 'all', label: 'Tous types' },
	{ id: 'managed', label: 'Collèges' },
];

type TabId = (typeof tabs)[number]['id'];

interface FicheDepartementProps {
	departement: Departement;
	ficheRef?: React.RefObject<HTMLDivElement | null>;
	onBeforePrint?: () => void;
	onAfterPrint?: () => void;
}

export default function FicheDepartement({
	departement,
	ficheRef,
	onBeforePrint,
	onAfterPrint,
}: FicheDepartementProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<article aria-label={`Fiche du département ${departement.libelle_departement}`}>
			<CollectiviteHeaderCard type='departement' nom={departement.libelle_departement} />
			<ActionButtons
				ficheRef={ficheRef}
				ficheName={departement.libelle_departement}
				onBeforePrint={onBeforePrint}
				onAfterPrint={onAfterPrint}
			/>
			<hr className='my-4' />
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='departement' />
			<br />
			{activeTab === 'all' ? (
				<>
					<PotentielSolaireCard
						potentielSolaire={departement.potentiel_solaire_total}
						potentielNbFoyers={departement.potentiel_nb_foyers_total}
						nbEleves={departement.nb_eleves_total}
						thresholds={COLOR_THRESHOLDS['departement']}
						header={
							<NbEtablissements
								nbEtablissements={departement.nb_etablissements_total}
								niveau='etablissements'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Établissements'
						repartition={departement.nb_etablissements_par_niveau_potentiel_total}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={departement.top_etablissements_total} />
				</>
			) : (
				<>
					<PotentielSolaireCard
						potentielSolaire={departement.potentiel_solaire_colleges}
						potentielNbFoyers={departement.potentiel_nb_foyers_colleges}
						nbEleves={departement.nb_eleves_colleges}
						thresholds={COLOR_THRESHOLDS_BY_TYPE_ETABLISSEMENT['Collège']}
						header={
							<NbEtablissements
								nbEtablissements={departement.nb_etablissements_colleges}
								niveau='college'
							/>
						}
					/>
					<hr className='my-4' />
					<RepartitionPotentielSolaire
						niveau='Collèges'
						repartition={departement.nb_etablissements_par_niveau_potentiel_colleges}
					/>
					<hr className='my-4' />
					<TopCard topEtablissements={departement.top_etablissements_colleges} />
				</>
			)}
		</article>
	);
}
