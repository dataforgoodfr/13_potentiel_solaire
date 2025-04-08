import { CommuneProperties } from '@/app/models/communes';
import { Info } from 'lucide-react';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import CollectiviteHeaderCard from './CollectiviteHeaderCard';
import PotentielSolaireCard from './PotentielSolaireCard';
import RepartitionPotentielSolaire from './RepartitionPotentielSolaire';
import TopPrimairesCard from './TopPrimairesCard';

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

			<div className='mb-4 flex gap-4 rounded-lg bg-gray-100 p-2'>
				<Info size={48} />
				<div>
					<p>La commune est responsable des bâtiments des écoles primaires.</p>
					<p className='text-sm italic'>
						Pour les collèges, choisissez la vue département et pour les lycées la vue
						région.
					</p>
				</div>
			</div>

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

			<TopPrimairesCard topEtablissements={commune.top_etablissements_primaires} />
			<br />
			<AccordionCard />
		</div>
	);
}
