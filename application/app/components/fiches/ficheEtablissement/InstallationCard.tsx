import { Ruler } from 'lucide-react';

const SUPERFICIE_TEXT = 'Superficie exploitable maximale : ';
const SQUARE_METERS = 'M²';
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
				<p className='font-bold'>{SUPERFICIE_TEXT}</p>
			</div>
			<p
				className='text-center font-bold text-blue'
				aria-label={
					hasSurface
						? `${SUPERFICIE_TEXT} environ ${surfaceExploitableMax} ${SQUARE_METERS}`
						: `${SUPERFICIE_TEXT} ${UNKNOWN_TEXTS.surfaceExploitableMax}`
				}
			>
				<span className='text-base' aria-hidden='true'>
					{hasSurface ? `≈${surfaceExploitableMax}` : UNKNOWN_TEXTS.surfaceExploitableMax}
				</span>{' '}
				{hasSurface && SQUARE_METERS}
			</p>
		</article>
	);
};
export default InstallationCard;
