import { useState } from 'react';

import { CommuneProperties } from '@/app/models/communes';
import { Etablissement } from '@/app/models/etablissements';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import CollectiviteHeaderCard from './CollectiviteHeaderCard';
import PotentielSolaireCard from './PotentielSolaireCard';
import RepartitionPotentielSolaire from './RepartitionPotentielSolaire';
import ResponsabiliteMessage from './ResponsabiliteMessage';
import TopCard from './TopCard';
import FicheEtablissement from './ficheEtablissement/ficheEtablissement';

interface FicheCommuneProps {
	commune: CommuneProperties;
}

export default function FicheCommune({ commune }: FicheCommuneProps) {
	const [selectedEtablissement, setSelectedEtablissement] = useState<Etablissement | null>(null);

	const topEtablissements = [
		{ identifiant_de_l_etablissement: '9710648C', nom_etablissement: 'Ecole primaire Grand Camp 1', potentiel_solaire: 677957 },
		{ identifiant_de_l_etablissement: '9710514G', nom_etablissement: 'Ecole primaire Maurice St-Pierre', potentiel_solaire: 632018 },
		{
			identifiant_de_l_etablissement: '9711292C',
			nom_etablissement:
				'Ecole élémentaire publique Germaine Petit-Devaed du Groupe Scolaire Guy Cornely',
			potentiel_solaire: 511879,
		},
	];
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
			<ResponsabiliteMessage niveau='commune' />
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
			<TopCard
				topEtablissements={topEtablissements}
				setSelectedEtablissement={setSelectedEtablissement}
			/>
			<br />
			{selectedEtablissement && (
				<FicheEtablissement
					feature={selectedEtablissement}
					onClose={() => setSelectedEtablissement(null)}
				/>
			)}

			<AccordionCard />
		</div>
	);
}
