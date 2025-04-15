import { ChartPie, Ruler } from 'lucide-react';

const UNKNOWN_TEXTS = {
	surface_utile: 'Non disponible',
};

interface installationCardProps {
	surface_utile?: number;
}

const InstallationCard = ({ surface_utile }: installationCardProps) => {
	return (
		<div>
			<div className='flex gap-1'>
				<Ruler />
				<p className='font-medium'>Superficie exploitable maximale: </p>
			</div>
			<p className='text-center font-medium'>
				<span className='text-xl'>≈{surface_utile || UNKNOWN_TEXTS.surface_utile}</span> M²
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
