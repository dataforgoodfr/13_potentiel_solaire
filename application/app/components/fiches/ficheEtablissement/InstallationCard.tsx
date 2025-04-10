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
			<div className='flex gap-1'>
				<Ruler />
				<p className='font-medium'>Superficie exploitable maximale: </p>
			</div>
			<p className='text-center font-medium'>
				<span className='text-xl'>
					≈{surface_exploitable_max || UNKNOWN_TEXTS.surface_exploitable_max}
				</span>{' '}
				M²
			</p>
			<br />
			<div className='flex gap-1'>
				<ChartPie />
				<p className='font-medium'>
					Estimation des revenus mensuels maximaux de l&apos;installation
				</p>
			</div>
		</div>
	);
};
export default InstallationCard;
