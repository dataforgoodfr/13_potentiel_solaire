import { EtablissementLite } from '@/app/models/etablissements';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CircleAlert } from 'lucide-react';

const RATTACHEMENT_TEXT = "D'autres établissements sont présents dans cette zone :";

interface RattachementCardProps {
	etablissements_rattaches: EtablissementLite[];
}

const RattachementCard: React.FC<RattachementCardProps> = ({ etablissements_rattaches }) => {
	return (
		<div className={'mb-2 flex gap-4 rounded-md bg-gray p-2'}>
			<CircleAlert size={40} />
			<div className={''}>
				<p className='mb-2 text-sm font-normal text-blue'>{RATTACHEMENT_TEXT}</p>
				<ul className='list-none space-y-4 pl-0 font-bold text-darkgreen'>
					{etablissements_rattaches.map((etab) => (
						<li key={etab.identifiant_de_l_etablissement}>
							{/* <Link
								href={`/etablissement/${etab.identifiant_de_l_etablissement}`}
								className='underline decoration-dotted decoration-2 underline-offset-4 transition hover:text-primary'
							>
								{etab.nom_etablissement}
							</Link> */}
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger asChild>
										<span
											className='hover:bg-gray-100 rounded text-darkgreen transition'
											aria-disabled='true'
										>
											<span
												// href={`/etablissement/${etab.identifiant_de_l_etablissement}`}
												aria-disabled='true'
												className='underline decoration-dotted decoration-2 underline-offset-4 transition hover:text-primary'
											>
												{etab.nom_etablissement}
											</span>
										</span>
									</Tooltip.Trigger>
									<Tooltip.Portal>
										<Tooltip.Content
											className='z-50 rounded bg-blue px-3 py-1.5 text-xs text-white shadow'
											sideOffset={5}
										>
											Cette fonctionnalité n&apos;est pas encore disponible !
											<Tooltip.Arrow className='fill-black' />
										</Tooltip.Content>
									</Tooltip.Portal>
								</Tooltip.Root>
							</Tooltip.Provider>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default RattachementCard;
