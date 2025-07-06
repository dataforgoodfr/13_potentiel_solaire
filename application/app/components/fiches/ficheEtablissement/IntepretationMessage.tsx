import Image from 'next/image';

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

const ICON_SRC: Record<NiveauPotentiel, string> = {
	'1_HIGH': '/images/HIGH.svg',
	'2_GOOD': '/images/GOOD.svg',
	'3_LIMITED': '/images/LIMITED.svg',
};

const ALT_LABELS: Record<NiveauPotentiel, string> = {
	'1_HIGH': 'élevé',
	'2_GOOD': 'bon',
	'3_LIMITED': 'limité',
};

interface InterpretationMessageProps {
	niveau_potentiel: NiveauPotentiel;
}

const InterpretationMessage = ({ niveau_potentiel }: InterpretationMessageProps) => {
	return (
		<div
			className={`relative overflow-hidden rounded-xl py-5 ${SOLAR_INTERPRETATION_CSS_CLASS[niveau_potentiel]}`}
		>
			<div className='flex items-center overflow-visible'>
				<div className='relative w-1/3 -rotate-12'>
					<Image
						src={ICON_SRC[niveau_potentiel]}
						alt={`Potentiel ${ALT_LABELS[niveau_potentiel]}`}
						width={143}
						height={130}
						className='animate-slide-in absolute -bottom-16 -left-8 motion-reduce:animate-none'
					/>
				</div>

				<div className='w-2/3'>
					<p className='text-sm font-normal md:text-base'>
            <span className='sr-only'>Niveau de potentiel solaire : </span>
						{SOLAR_TEXT[niveau_potentiel]}
					</p>
				</div>
			</div>
		</div>
	);
};

export default InterpretationMessage;
