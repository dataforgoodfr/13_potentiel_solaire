import { Etablissement } from '@/app/models/etablissements';

import {
	ELU_BODY,
	ELU_INTRO_SHORT,
	PARTICULIER_BODY,
	PARTICULIER_INTRO_SHORT,
} from '../../content/accordion-actions';
import AccordionCard from '../shared/AccordionCard';
import ActionButtons from '../shared/ActionButtons';
import PotentielSolaireCard from '../shared/PotentielSolaireCard';
import EtablissementCard from './EtablissementCard';
import GraphiqueCard from './GraphiqueCard';
import InstallationCard from './InstallationCard';
import InterpretationMessage from './IntepretationMessage';
import ProtectionCard from './ProtectionCard';

const actionsShort = [
	{
		title: 'Je suis un élu et je veux agir',
		content: (
			<>
				{ELU_INTRO_SHORT}
				{ELU_BODY}
			</>
		),
	},
	{
		title: 'Je suis un particulier et je veux agir',
		content: (
			<>
				{PARTICULIER_INTRO_SHORT}
				{PARTICULIER_BODY}
			</>
		),
	},
];

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
				<GraphiqueCard />
			</div>
			<hr className='my-4' />
			<AccordionCard actions={actionsShort} />
		</div>
	);
}
