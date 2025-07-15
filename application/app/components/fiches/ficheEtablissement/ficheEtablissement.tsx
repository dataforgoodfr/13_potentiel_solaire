import { Etablissement } from '@/app/models/etablissements';

import ActionButtons from '../shared/ActionButtons';
import PotentielSolaireCard from '../shared/PotentielSolaireCard';
import EtablissementCard from './EtablissementCard';
// import GraphiqueCard from './GraphiqueCard';
import InstallationCard from './InstallationCard';
import InterpretationMessage from './IntepretationMessage';
import ProtectionCard from './ProtectionCard';
import RattachementCard from './RattachementCard';

interface FicheEtablissementProps {
	etablissement: Etablissement;
}

export default function FicheEtablissement({ etablissement }: FicheEtablissementProps) {
	return (
		<div>
			<EtablissementCard {...etablissement} />
			<br />
			<ActionButtons />
			<hr className='my-4' />

			{etablissement.est_seul_dans_sa_zone === false &&
				etablissement.etablissements_rattaches && (
					<RattachementCard
						etablissements_rattaches={etablissement.etablissements_rattaches}
					/>
				)}
			{etablissement.protection && <ProtectionCard />}
			<PotentielSolaireCard
				potentielSolaire={etablissement.potentiel_solaire}
				potentielNbFoyers={etablissement.potentiel_nb_foyers}
				nbEleves={etablissement.nb_eleves ?? undefined}
				level='etablissement'
				header={<InterpretationMessage niveau_potentiel={etablissement.niveau_potentiel} />}
			/>
			<hr className='my-4' />
			<div className='ml-2'>
				<InstallationCard surfaceExploitableMax={etablissement.surface_exploitable_max} />
				{/* <GraphiqueCard /> */}
			</div>
		</div>
	);
}
