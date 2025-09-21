import { Loader } from 'lucide-react';

export default function Loading() {
	return (
		<div
			className='flex h-[100%] w-[100%] items-center justify-center text-center'
			role='status'
			aria-live='polite'
			aria-label='Chargement en cours'
		>
			<Loader className='animate-spin text-primary' />
			<span className='sr-only'>Chargement en cours</span>
		</div>
	);
}
