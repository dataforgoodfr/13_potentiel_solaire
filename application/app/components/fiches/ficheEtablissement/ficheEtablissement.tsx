import { Etablissement } from '@/app/models/etablissements';

import AccordionCard from '../shared/AccordionCard';
import ActionButtons from '../shared/ActionButtons';
import PotentielSolaireCard from '../shared/PotentielSolaireCard';
import EtablissementCard from './EtablissementCard';
import GraphiqueCard from './GraphiqueCard';
import InstallationCard from './InstallationCard';
import ProtectionCard from './ProtectionCard';

interface FicheEtablissementProps {
	etablissement: Etablissement;
	onClose: () => void;
}

export default function FicheEtablissement({ etablissement }: FicheEtablissementProps) {
	if (!etablissement) return null;

	return (
		<div>
			<EtablissementCard {...etablissement} />
			<br />
			<ActionButtons />
			<hr className='my-4' />
			{etablissement.protection && <ProtectionCard />}
			<PotentielSolaireCard
				potentielSolaire={etablissement.potentiel_solaire}
				showInterpretation
				showNbEtablissements={false}
				nbEleves={etablissement.nb_eleves ?? undefined}
				level='etablissement'
			/>
			<hr className='my-4' />
			<div className='ml-2'>
				<InstallationCard surfaceExploitableMax={etablissement.surface_exploitable_max} />
				<GraphiqueCard />
			</div>
			<hr className='my-4' />
			<AccordionCard />
		</div>
	);
}
