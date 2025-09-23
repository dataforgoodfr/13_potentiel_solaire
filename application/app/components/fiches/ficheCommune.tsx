import { useState } from 'react';

import { Commune } from '@/app/models/communes';

import { COLOR_THRESHOLDS, COLOR_THRESHOLDS_BY_TYPE_ETABLISSEMENT } from '../Map/constants';
import NbEtablissements from './NbEtablissements';
import ActionButtons from './shared/ActionButtons';
import CollectiviteHeaderCard from './shared/CollectiviteHeaderCard';
import PotentielSolaireCard from './shared/PotentielSolaireCard';
import RepartitionPotentielSolaire from './shared/RepartitionPotentielSolaire';
import ResponsabiliteMessage from './shared/ResponsabiliteMessage';
import Tabs from './shared/Tabs';
import TopCard from './shared/TopCard';

const tabs = [
	{ id: 'all', label: 'Tous types' },
	{ id: 'managed', label: 'Écoles primaires' },
];

type TabId = (typeof tabs)[number]['id'];

interface FicheCommuneProps {
	commune: Commune;
	ficheRef?: React.RefObject<HTMLDivElement | null>;
	onBeforePrint?: () => void;
	onAfterPrint?: () => void;
}

export default function FicheCommune({
	commune,
	ficheRef,
	onBeforePrint,
	onAfterPrint,
}: FicheCommuneProps) {
	const [activeTab, setActiveTab] = useState<TabId>('all');

	const handleTabChange = (tab: TabId) => {
		setActiveTab(tab);
	};

	return (
		<article aria-label={`Fiche de la commune ${commune.nom_commune}`}>
			<CollectiviteHeaderCard type='commune' nom={commune.nom_commune} />
			<ActionButtons
				ficheRef={ficheRef}
				ficheName={commune.nom_commune}
				onBeforePrint={onBeforePrint}
				onAfterPrint={onAfterPrint}
			/>
			<hr className='my-4' />
			<Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
			<ResponsabiliteMessage niveau='commune' />
			<br />
			{activeTab === 'all' ? (
				<>
					<PotentielSolaireCard
						potentielSolaire={commune.potentiel_solaire_total}
						potentielNbFoyers={commune.potentiel_nb_foyers_total}
						nbEleves={commune.nb_eleves_total}
						thresholds={COLOR_THRESHOLDS['commune']}
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
						thresholds={COLOR_THRESHOLDS_BY_TYPE_ETABLISSEMENT['Ecole']}
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
		</article>
	);
}
