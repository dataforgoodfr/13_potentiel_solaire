import { ChartPie, Ruler } from 'lucide-react';

const UNKNOWN_TEXTS = {
	surface_exploitable_max: 'Non disponible',
};

interface installationCardProps {
	surface_exploitable_max?: number;
}

const InstallationCard = ({ surface_exploitable_max }: installationCardProps) => {
	return (
		<div>
			<div className='flex gap-1 text-sm text-grey'>
				<Ruler />
				<p className='font-bold'>Superficie exploitable maximale : </p>
			</div>
			<p className='text-center font-bold text-blue'>
				<span className='text-xl'>
					≈{surface_exploitable_max || UNKNOWN_TEXTS.surface_exploitable_max}
				</span>{' '}
				M²
			</p>
			<br />
			<div className='flex gap-1 text-sm text-grey'>
				<ChartPie />
				<p className='font-bold'>
					Estimation des revenus mensuels maximaux de l&apos;installation
				</p>
			</div>
		</div>
	);
};
export default InstallationCard;
