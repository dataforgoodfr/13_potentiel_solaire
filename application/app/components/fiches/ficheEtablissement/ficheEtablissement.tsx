import { Etablissement } from '@/app/models/etablissements';

import { COLOR_THRESHOLDS } from '../../Map/constants';
import ActionButtons from '../shared/ActionButtons';
import PotentielSolaireCard from '../shared/PotentielSolaireCard';
import EtablissementCard from './EtablissementCard';
import InstallationCard from './InstallationCard';
import InterpretationMessage from './IntepretationMessage';
import ProtectionCard from './ProtectionCard';
import RattachementCard from './RattachementCard';

interface FicheEtablissementProps {
	etablissement: Etablissement;
	ficheRef?: React.RefObject<HTMLDivElement | null>;
	onBeforePrint?: () => void;
	onAfterPrint?: () => void;
}

export default function FicheEtablissement({
	etablissement,
	ficheRef,
	onBeforePrint,
	onAfterPrint,
}: FicheEtablissementProps) {
	const donneesDisponibles = etablissement.reussite_rattachement;

	return (
		<article aria-label={`Fiche de l’établissement ${etablissement}`}>
			<EtablissementCard {...etablissement} />
			<br />
			<ActionButtons
				ficheRef={ficheRef}
				ficheName={etablissement.nom_etablissement}
				onBeforePrint={onBeforePrint}
				onAfterPrint={onAfterPrint}
			/>

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
				thresholds={COLOR_THRESHOLDS['etablissement']}
				header={<InterpretationMessage niveau_potentiel={etablissement.niveau_potentiel} />}
				grise={!donneesDisponibles}
			/>
			{donneesDisponibles && (
				<>
					<hr className='my-4' />
					<div className='ml-2'>
						<InstallationCard
							surfaceExploitableMax={etablissement.surface_exploitable_max}
						/>
					</div>
				</>
			)}
		</article>
	);
}
