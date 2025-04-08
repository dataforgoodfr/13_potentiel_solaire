import { DepartementProperties } from '@/app/models/departements';
import { Info } from 'lucide-react';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import CollectiviteHeaderCard from './CollectiviteHeaderCard';
import PotentielSolaireCard from './PotentielSolaireCard';
import RepartitionPotentielSolaire from './RepartitionPotentielSolaire';
import TopPrimairesCard from './TopPrimairesCard';

interface FicheDepartementProps {
	departement: DepartementProperties;
}

export default function FicheDepartement({ departement }: FicheDepartementProps) {
	return (
		<div>
			<CollectiviteHeaderCard
				type='departement'
				nom={departement.libelle_departement}
				nbEleves={departement.nb_eleves_colleges}
				niveau='de collèges'
			/>
			<br />
			<ActionButtons />
			<hr className='my-4' />

			<div className='mb-4 flex gap-4 rounded-lg bg-gray-100 p-2'>
				<Info size={48} />
				<div>
					<p>La departement est responsable des bâtiments des collèges.</p>
					<p className='text-sm italic'>
						Pour les écoles élémentaires, choisissez la vue commune et pour les lycées
						la vue région.
					</p>
				</div>
			</div>

			<br />
			<PotentielSolaireCard
				potentiel_solaire={departement.potentiel_solaire_colleges}
				nb_etablissements={departement.nb_etablissements_colleges}
				niveau='de collèges'
			/>
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

			<TopPrimairesCard topEtablissements={departement.top_etablissements_colleges} />
			<br />
			<AccordionCard />
		</div>
	);
}
