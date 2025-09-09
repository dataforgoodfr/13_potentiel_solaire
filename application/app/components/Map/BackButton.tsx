import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
	onBack: () => void;
};

export default function BackButton({ onBack }: BackButtonProps) {
	return (
		<Button
			onClick={onBack}
			className='flex items-center gap-2 rounded-md border border-white bg-blue text-sm shadow-md'
			size='sm'
			aria-label='Retour'
		>
			<ChevronLeft size={20} />
			<span className='hidden sm:block'>Retour</span>
		</Button>
	);
}
