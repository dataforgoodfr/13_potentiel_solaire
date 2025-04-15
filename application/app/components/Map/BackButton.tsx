import { Button } from '@/components/ui/button';

type BackButtonProps = {
	onBack: () => void;
};

export default function BackButton({ onBack }: BackButtonProps) {
	return (
		<Button onClick={onBack} className='absolute right-4 top-4'>
			Retour
		</Button>
	);
}
