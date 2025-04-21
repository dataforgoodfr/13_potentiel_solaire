import { NiveauPotentiel } from '@/app/models/common';

const SOLAR_TEXT: Record<NiveauPotentiel, string> = {
	'1_HIGH': 'Le potentiel solaire de cet établissement me paraît tout-à-fait rayonnant !',
	'2_GOOD': 'Le potentiel solaire de cet établissement me paraît plutôt satisfaisant !',
	'3_LIMITED':
		'Le potentiel solaire de cet établissement me paraît un peu limité, mais pas impossible pour autant !',
};

const SOLAR_INTERPRETATION_CSS_CLASS: Record<NiveauPotentiel, string> = {
	'1_HIGH': 'bg-sol_top',
	'2_GOOD': 'bg-green',
	'3_LIMITED': 'bg-sol_ko',
};

interface InterpretationMessageProps {
	niveau_potentiel: NiveauPotentiel;
}

const InterpretationMessage = ({ niveau_potentiel }: InterpretationMessageProps) => {
	return (
		<div className={`rounded-xl p-5 ${SOLAR_INTERPRETATION_CSS_CLASS[niveau_potentiel]}`}>
			<p className='font-normal'>{SOLAR_TEXT[niveau_potentiel]}</p>
		</div>
	);
};

export default InterpretationMessage;
