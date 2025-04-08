import { RegionProperties } from '@/app/models/regions';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import CollectiviteHeaderCard from './CollectiviteHeaderCard';
import PotentielSolaireCard from './PotentielSolaireCard';
import RepartitionPotentielSolaire from './RepartitionPotentielSolaire';
import ResponsabiliteMessage from './ResponsabiliteMessage';
import TopCard from './TopCard';

interface FicheRegionProps {
	region: RegionProperties;
}

export default function FicheRegion({ region }: FicheRegionProps) {
	return (
		<div>
			<CollectiviteHeaderCard
				type='region'
				nom={region.libelle_region}
				nbEleves={region.nb_eleves_lycees}
				niveau='de lycées'
			/>
			<br />
			<ActionButtons />
			<hr className='my-4' />
			<ResponsabiliteMessage niveau='region' />
			<br />
			<PotentielSolaireCard
				potentiel_solaire={region.potentiel_solaire_lycees}
				nb_etablissements={region.nb_etablissements_lycees}
				niveau='de lycées'
			/>
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
