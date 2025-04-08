import { Commune } from '@/app/models/communes';
import { CircleHelp, HousePlug, Info, Sun, University, Zap } from 'lucide-react';

import AccordionCard from '../fiches/ficheEtablissement/AccordionCard';
import ActionButtons from '../fiches/ficheEtablissement/ActionButtons';

interface FicheCommuneProps {
	commune: Commune;
}

export default function FicheCommune({ commune }: FicheCommuneProps) {
	const consommationParFoyer = 2300;
	const personnesParFoyer = 2;
	const consoTotaleParFoyer = personnesParFoyer * consommationParFoyer;
	const equivalentFoyers = Math.round(commune.potentiel_solaire / consoTotaleParFoyer);

	return (
		<div>
			<h1 className='text-xl font-bold'>{commune.nom_commune}</h1>
			<p className='text-gray-600'>Commune</p>
			<br />
			<p>
				<span className='text-xl'>102 345</span> élèves d&apos;écoles primaires concernés
			</p>
			<br />
			<ActionButtons />

			<hr className='my-4' />

			<div className='mb-4 flex gap-4 rounded-lg bg-gray-100 p-2'>
				<Info size={48} />
				<div>
					<p>La commune est responsable des bâtiments des écoles primaires.</p>
					<p className='text-sm italic'>
						Pour les collèges, choisissez la vue département et pour les lycées la vue
						région.
					</p>
				</div>
			</div>

			<br />

			<div className='mb-4 rounded-2xl border-4 border-solid bg-gray-100 p-2 outline-gray-300'>
				<div className='flex gap-1'>
					<University />
					<p className='text-base font-bold'>Nombre total d&apos;écoles primaires :</p>
				</div>
				<p className='font-bold'>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<span className='text-3xl'>{commune.count_etablissements}</span>
				</p>

				<br />
				<div className='flex gap-1'>
					<Zap />
					<p className='text-base font-bold'>Potentiel de production annuelle :</p>
				</div>
				<p className='font-bold'>
					🟡 &nbsp;
					<span className='text-3xl'>{commune.potentiel_solaire}</span>
					&nbsp;MWh/an
				</p>
				<br />

				<div className='flex gap-1'>
					<HousePlug />
					<p className='text-base font-bold'>
						&nbsp;Équivalent à la consommation électrique annuelle de :
					</p>
				</div>
				<div className='flex w-full items-center justify-between ps-7 text-darkgreen'>
					<div className='flex items-center gap-2'>
						<span className='text-3xl font-bold text-darkgreen'>
							{equivalentFoyers}
						</span>
						<div className='flex flex-col text-sm leading-tight'>
							<span className='font-bold'>foyers de</span>
							<span className='font-bold'>4 personnes</span>
						</div>
					</div>
					<CircleHelp />
				</div>
			</div>

			<hr className='my-4' />

			<p>🟠 Écoles potentiel solaire élevé :</p>
			<p className='text-center text-xl font-bold'>ND</p>
			<br />
			<p>🟡 Écoles potentiel solaire bon :</p>
			<p className='text-center text-xl font-bold'>ND</p>
			<br />
			<p>⚪️ Écoles potentiel solaire bas :</p>
			<p className='text-center text-xl font-bold'>ND</p>

			<hr className='my-4' />

			<div className='flex gap-1'>
				<Sun />
				<p>Top 3 potentiel solaire :</p>
			</div>
			<ul className='list-none pl-0 font-bold text-darkgreen'>
				<li>🥇 École 1</li>
				<li>🥈 École 2</li>
				<li>🥉 École 3</li>
			</ul>
			<br />
			<AccordionCard />
		</div>
	);
}
