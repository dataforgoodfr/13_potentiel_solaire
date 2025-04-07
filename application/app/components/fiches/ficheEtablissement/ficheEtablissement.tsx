import { Etablissement } from '@/app/models/etablissements';

import AccordionCard from './AccordionCard';
import ActionButtons from './ActionButtons';
import EtablissementCard from './EtablissementCard';
import GraphiqueCard from './GraphiqueCard';
import InstallationCard from './InstallationCard';
import PotentielSolaireCard from './PotentielSolaireCard';
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
			<ProtectionCard isProtected={!!feature.protection} />
			<PotentielSolaireCard potentiel_solaire={feature.potentiel_solaire} />
			<hr className='my-4' />
			<div className='ml-2'>
				<InstallationCard surface_utile={feature.surface_utile} />
				<GraphiqueCard />
			</div>
			<hr className='my-4' />
			<AccordionCard />
		</div>
	);
}
