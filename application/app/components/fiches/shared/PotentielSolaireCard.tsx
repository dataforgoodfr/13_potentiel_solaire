import { CircleHelp, HousePlug, University, Users, Zap } from 'lucide-react';

const UNKNOWN_TEXTS = {
	potentiel_solaire: '—',
	nb_etablissements: '—',
	nb_eleves: "Nombre d'élèves concernés inconnu",
};

const SOLAR_TEXT = {
	high: 'Le potentiel solaire de cet établissement me paraît tout à fait rayonnant',
	low: 'Des optimisations sont à prévoir pour un bon potentiel solaire',
};

const FOYER_CONSO_KWH = 2300;
const PERSONNES_PAR_FOYER = 2;
const HIGH_SOLAR_THRESHOLD = 500_000;

interface PotentielSolaireCardProps {
	potentiel_solaire?: number;
	nb_etablissements?: number;
	niveau?: string;
	nb_eleves?: number;
	showInterpretation?: boolean;
	showNbEtablissements?: boolean;
}

function potentielSolaireEnFoyers(potentiel?: number): number | string {
	if (potentiel === undefined) return UNKNOWN_TEXTS.potentiel_solaire;
	return Math.round(potentiel / FOYER_CONSO_KWH / PERSONNES_PAR_FOYER);
}

function potentielSolaireEnMWh(potentiel?: number): number | string {
	if (potentiel === undefined) return UNKNOWN_TEXTS.potentiel_solaire;
	return Math.round(potentiel / 1000);
}

export default function PotentielSolaireCard({
	potentiel_solaire,
	nb_etablissements,
	niveau,
	nb_eleves,
	showInterpretation = false,
	showNbEtablissements = true,
}: PotentielSolaireCardProps) {
	const isHigh = (potentiel_solaire ?? 0) > HIGH_SOLAR_THRESHOLD;

	return (
		<div className='mb-4 rounded-2xl border-4 border-solid bg-gray-100 p-2 outline-gray-300'>
			{showInterpretation && (
				<>
					<div
						className={isHigh ? 'rounded-xl bg-green p-5' : 'rounded-xl bg-yellow p-5'}
					>
						<p className='font-normal'>{isHigh ? SOLAR_TEXT.high : SOLAR_TEXT.low}</p>
					</div>
					<br />
				</>
			)}

			{showNbEtablissements && (
				<>
					<div className='text-grey flex gap-1'>
						<University />
						<p className='text-sm font-bold'>Nombre total {niveau} :</p>
					</div>
					<p className='text-grey font-bold'>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<span className='text-3xl'>
							{nb_etablissements !== undefined && nb_etablissements !== null
								? nb_etablissements
								: UNKNOWN_TEXTS.nb_etablissements}
						</span>
					</p>
					<br />
				</>
			)}

			<div className='text-grey flex gap-1'>
				<Users />
				{nb_eleves !== undefined ? (
					<>
						<p className='font-bold'>
							<span className='text-xl'>{nb_eleves.toLocaleString('fr-FR')}</span>{' '}
							élèves concernés
						</p>
					</>
				) : (
					<span className='italic text-gray-500'>{UNKNOWN_TEXTS.nb_eleves}</span>
				)}
			</div>

			<div className='text-grey mt-5 flex gap-1'>
				<Zap />
				<p className='text-sm font-bold'>Potentiel de production annuelle :</p>
			</div>
			<p className='font-bold text-blue'>
				🟡 &nbsp;
				<span className='text-3xl'>{potentielSolaireEnMWh(potentiel_solaire)}</span>
				&nbsp;MWh/an
			</p>
			<br />

			<div className='text-grey flex gap-1'>
				<HousePlug size={36} />
				<p className='text-sm font-bold'>
					&nbsp;Équivalent à la consommation électrique annuelle de :
				</p>
			</div>
			<div className='flex w-full items-center justify-between ps-7 text-darkgreen'>
				<div className='flex items-center gap-2'>
					<span className='text-3xl font-bold text-darkgreen'>
						{potentielSolaireEnFoyers(potentiel_solaire)}
					</span>
					<div className='flex flex-col text-sm leading-tight'>
						<span className='font-bold'>foyers de</span>
						<span className='font-bold'>2 personnes</span>
					</div>
				</div>
				<CircleHelp />
			</div>
		</div>
	);
}
