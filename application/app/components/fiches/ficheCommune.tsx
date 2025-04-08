import { CommuneProperties } from '@/app/models/communes';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import CollectiviteHeaderCard from './CollectiviteHeaderCard';
import PotentielSolaireCard from './PotentielSolaireCard';
import ResponsabiliteMessage from './ResponsabiliteMessage';
import RepartitionPotentielSolaire from './RepartitionPotentielSolaire';
import TopCard from './TopCard';

interface FicheCommuneProps {
	commune: CommuneProperties;
}

export default function FicheCommune({ commune }: FicheCommuneProps) {
	return (
		<div>
			<CollectiviteHeaderCard
				type='commune'
				nom={commune.nom_commune}
				nbEleves={commune.nb_eleves_primaires}
				niveau="d'écoles primaires"
			/>
			<br />
			<ActionButtons />
			<hr className='my-4' />
      <ResponsabiliteMessage niveau="commune" />
			<br />
			<PotentielSolaireCard
				potentiel_solaire={commune.potentiel_solaire_primaires}
				nb_etablissements={commune.nb_etablissements_primaires}
				niveau="d'écoles primaires"
			/>
			<hr className='my-4' />
			<RepartitionPotentielSolaire
				niveau='Écoles'
				repartition={{
					eleve: commune.nb_etablissements_potentiel_eleve_primaires,
					bon: commune.nb_etablissements_potentiel_bon_primaires,
					bas: commune.nb_etablissements_potentiel_bas_primaires,
				}}
			/>
			<hr className='my-4' />
			<TopCard topEtablissements={commune.top_etablissements_primaires} />
			<br />
			<AccordionCard />
		</div>
	);
}
