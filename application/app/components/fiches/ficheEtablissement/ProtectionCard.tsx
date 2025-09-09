import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CircleAlert } from 'lucide-react';

const PROTECTION_TEXT = 'Une partie de cet établissement est située en zone protégée';

const ProtectionCard: React.FC = () => {
	return (
		<div className={'mb-4 flex flex-col rounded-md bg-orange p-2'}>
			<div className={'flex gap-4 rounded-md p-2'}>
				<CircleAlert color='orange' size={40} />
				<p className='text-sm font-normal text-blue'>{PROTECTION_TEXT}</p>
			</div>
			<Collapsible>
				<CollapsibleTrigger>Voir plus</CollapsibleTrigger>
				<CollapsibleContent>
					<div className='p-4'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
						non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default ProtectionCard;
