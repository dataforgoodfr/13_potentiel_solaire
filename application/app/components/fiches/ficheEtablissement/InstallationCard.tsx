import { ChartPie, Ruler } from 'lucide-react';

const UNKNOWN_TEXTS = {
	surfaceExploitableMax: 'Superficie non disponible',
};

interface installationCardProps {
	surfaceExploitableMax?: number;
}

const InstallationCard = ({ surfaceExploitableMax }: installationCardProps) => {
	const hasSurface = surfaceExploitableMax !== undefined;

	return (
		<div>
			<article aria-labelledby='surface-heading' className='flex gap-1 text-sm text-grey'>
				<Ruler aria-hidden='true' focusable='false' />
				<p id='surface-heading' className='font-bold'>
					Superficie exploitable maximale :{' '}
				</p>
			</article>
			<p className='text-center font-bold text-blue'>
				<span aria-hidden='true' className='text-xl'>
					{hasSurface ? `≈${surfaceExploitableMax}` : UNKNOWN_TEXTS.surfaceExploitableMax}
				</span>{' '}
				{hasSurface && 'M²'}
			</p>
			<span className='sr-only'>Environ {surfaceExploitableMax} mètres carrés</span>
			<br />
			<div className='flex gap-1 text-sm text-grey'>
				<ChartPie aria-hidden='true' focusable='false' />
				<p className='font-bold'>
					Estimation des revenus mensuels maximaux de l&apos;installation
				</p>
			</div>
		</div>
	);
};
export default InstallationCard;
