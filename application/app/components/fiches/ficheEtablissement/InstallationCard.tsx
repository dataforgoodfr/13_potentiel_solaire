import { ChartPie, Ruler } from 'lucide-react';

const UNKNOWN_TEXTS = {
	surfaceExploitableMax: 'Non disponible',
};

interface installationCardProps {
	surfaceExploitableMax?: number;
}

const InstallationCard = ({ surfaceExploitableMax }: installationCardProps) => {
	const hasSurface = surfaceExploitableMax !== undefined;

	return (
		<div>
			<div className='flex gap-1 text-sm text-grey'>
				<Ruler />
				<p className='font-bold'>Superficie exploitable maximale : </p>
			</div>
			<p className='text-center font-bold text-blue'>
				<span className='text-xl'>
					{hasSurface ? `≈${surfaceExploitableMax}` : UNKNOWN_TEXTS.surfaceExploitableMax}
				</span>{' '}
				{hasSurface && 'M²'}
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
