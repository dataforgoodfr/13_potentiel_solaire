import { CircleAlert } from 'lucide-react';

const PROTECTION_TEXT = 'Une partie de cet établissement est située en zone protégée';

const ProtectionCard: React.FC = () => {
	return (
		<div className={'mb-4 flex gap-4 rounded-md bg-orange p-2'}>
			<CircleAlert color='orange' size={40} />
			<p className='text-sm font-normal text-blue'>
				<span className='sr-only'>Niveau de potentiel solaire :</span>
				{PROTECTION_TEXT}
			</p>
		</div>
	);
};

export default ProtectionCard;
