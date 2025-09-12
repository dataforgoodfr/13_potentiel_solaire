import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import { Level } from './interfaces';
import { LEVEL_TO_LABEL_INCLUDING_NATION } from './layers/layers';

type BackButtonProps = {
	onBack: () => void;
	previousLevel: Level;
};

export default function BackButton({ onBack, previousLevel }: BackButtonProps) {
	return (
		<Button
			onClick={onBack}
			className='flex items-center gap-2 rounded-md border border-white bg-blue text-sm shadow-md'
			size='sm'
			aria-label={LEVEL_TO_LABEL_INCLUDING_NATION[previousLevel]}
		>
			<ChevronLeft size={20} />
			<span className='hidden sm:block'>
				{LEVEL_TO_LABEL_INCLUDING_NATION[previousLevel]}
			</span>
		</Button>
	);
}
