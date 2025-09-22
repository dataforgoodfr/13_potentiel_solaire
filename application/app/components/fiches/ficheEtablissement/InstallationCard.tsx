import { Ruler } from 'lucide-react';

const UNKNOWN_TEXTS = {
	surfaceExploitableMax: 'Superficie non disponible',
};

interface installationCardProps {
	surfaceExploitableMax?: number;
}

const InstallationCard = ({ surfaceExploitableMax }: installationCardProps) => {
	const hasSurface = surfaceExploitableMax !== undefined;

	return (
		<article>
			<div className='flex gap-1 text-sm text-grey'>
				<Ruler aria-hidden='true' focusable='false' />
				<p className='font-bold'>Superficie exploitable maximale : </p>
			</div>
			<p className='text-center font-bold text-blue' aria-label='Environ'>
				<span className='text-base' aria-hidden='true'>
					{hasSurface ? `≈${surfaceExploitableMax}` : UNKNOWN_TEXTS.surfaceExploitableMax}
				</span>{' '}
				{hasSurface && 'M²'}
			</p>
		</article>
	);
};
export default InstallationCard;
