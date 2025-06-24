import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
	onBack: () => void;
};

export default function BackButton({ onBack }: BackButtonProps) {
	return (
		<Button onClick={onBack} className='absolute right-4 top-4' aria-label='Revenir au niveau géographique précédent'>
			<ChevronLeft className='mr-2 h-4 w-4' />
			Retour
		</Button>
	);
}
