import { Loader } from 'lucide-react';

const LABELS = {
	ARIA_LOADING: 'Utiliser la géolocalisation',
};

export default function Loading() {
	return (
		<div
			className='flex h-[100%] w-[100%] items-center justify-center text-center'
			role='status'
			aria-live='polite'
			aria-label={LABELS.ARIA_LOADING}
		>
			<Loader className='animate-spin text-primary' />
		</div>
	);
}
