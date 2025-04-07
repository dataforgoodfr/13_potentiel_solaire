import { CircleHelp, HousePlug, Zap } from 'lucide-react';

const UNKNOWN_TEXTS = {
	potentiel_solaire: 'ND',
};

const SOLAR_TEXT = {
	high: 'Le potentiel solaire de cet établissement me paraît tout à fait rayonnant',
	low: 'Des optimisations sont à prévoir pour un bon potentiel solaire',
};

// TODO: valider les valeurs ci-dessous avec des sources précises
const FOYER_CONSO_KWH = 2300;
const PERSONNES_PAR_FOYER = 4;
const HIGH_SOLAR_THRESHOLD = 500_000;

interface potentielSolaireCardProps {
	potentiel_solaire?: number;
}

function potentielSolaireEnFoyers(potentielSolaire?: number): number | string {
	if (potentielSolaire === undefined) return UNKNOWN_TEXTS.potentiel_solaire;
	return Math.round(potentielSolaire / FOYER_CONSO_KWH / PERSONNES_PAR_FOYER);
}

const PotentielSolaireCard = ({ potentiel_solaire }: potentielSolaireCardProps) => {
	const isHigh = (potentiel_solaire ?? 0) > HIGH_SOLAR_THRESHOLD;

	const potentielAsMwh =
		potentiel_solaire !== undefined
			? Math.round(potentiel_solaire / 1000)
			: UNKNOWN_TEXTS.potentiel_solaire;

	return (
		<div className='mb-4 rounded-2xl bg-gray-100 p-2'>
			<div className={isHigh ? 'rounded-xl bg-green p-5' : 'rounded-xl bg-yellow p-5'}>
				<p className='font-normal'>{isHigh ? SOLAR_TEXT.high : SOLAR_TEXT.low}</p>
			</div>
			<br />

			<div className='flex gap-1'>
				<Zap />
				<p className='font-medium'>Potentiel de production annuelle :</p>
			</div>
			<p className='font-medium'>
				🟡 &nbsp;
				<span className='text-xl'>{potentielAsMwh}</span>
				MWh/an
			</p>

			<br />
			<div className='flex gap-1'>
				<HousePlug />
				<p className='font-medium'>
					&nbsp;Équivalent à la consommation électrique annuelle de :
				</p>
			</div>
			<div className='flex w-full items-center justify-between ps-7 text-darkgreen'>
				<div className='flex items-center gap-2'>
					<span className='text-2xl font-medium text-darkgreen'>
						{potentielSolaireEnFoyers(potentiel_solaire)}
					</span>
					<div className='flex flex-col text-sm leading-tight'>
						<span className='font-medium'>foyers de</span>
						<span className='font-medium'>4 personnes</span>
					</div>
				</div>
				<CircleHelp />
			</div>
		</div>
	);
};

export default PotentielSolaireCard;
