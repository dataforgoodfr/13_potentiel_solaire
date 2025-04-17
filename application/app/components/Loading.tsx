import { Loader } from 'lucide-react';

export default function Loading() {
	return (
		<div className='flex h-[100%] w-[100%] items-center justify-center text-center'>
			<Loader className='animate-spin text-primary' />
		</div>
	);
}
