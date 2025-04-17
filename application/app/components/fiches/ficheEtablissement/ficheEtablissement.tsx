import { Etablissement } from '@/app/models/etablissements';

import AccordionCard from '../shared/AccordionCard';
import ActionButtons from '../shared/ActionButtons';
import PotentielSolaireCard from '../shared/PotentielSolaireCard';
import EtablissementCard from './EtablissementCard';
import GraphiqueCard from './GraphiqueCard';
import InstallationCard from './InstallationCard';
import ProtectionCard from './ProtectionCard';

interface FicheEtablissementProps {
	feature: Etablissement;
	onClose: () => void;
}

export default function FicheEtablissement({ feature }: FicheEtablissementProps) {
	if (!feature) return null;

	return (
		<div>
			<EtablissementCard {...feature} />
			<br />
			<ActionButtons />
			<hr className='my-4' />
			{feature.protection && <ProtectionCard />}
			<PotentielSolaireCard
				potentielSolaire={feature.potentiel_solaire}
				showInterpretation
				showNbEtablissements={false}
				nbEleves={feature.nb_eleves ?? undefined}
				level='etablissement'
			/>
			<hr className='my-4' />
			<div className='ml-2'>
				<InstallationCard surfaceExploitableMax={feature.surface_exploitable_max} />
				<GraphiqueCard />
			</div>
			<hr className='my-4' />
			<AccordionCard />
		</div>
	);
}
