import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CircleAlert } from 'lucide-react';

const PROTECTION_TEXT = 'Une partie de cet établissement est située en zone protégée.';
const INFO_TRIGGER_TEXT = "Plus d'info";
const INFO_HIDE_TEXT = "Moins d'info";
const INFO_TEXT =
	"Cette zone classée bâtiment de France est une zone qui se trouve à proximité d'un monument ou d'un site historique protégé par la loi. Elle délimite des secteurs aux abord de sites historiques protégés, établissant un périmètre de 500m autour de chaque monument concerné. ";

const ProtectionCard: React.FC = () => {
	const [triggerText, setTriggerText] = useState<string>(INFO_TRIGGER_TEXT);

	return (
		<div className={'mb-4 flex gap-4 rounded-md bg-orange p-2'}>
			<CircleAlert color='orange' size={40} className='min-h-7 min-w-7 sm:h-10 sm:w-10' />
			<div className='text-sm font-normal text-blue'>
				{PROTECTION_TEXT}{' '}
				<Collapsible
					asChild
					defaultOpen={false}
					onOpenChange={(isOpen) => {
						if (isOpen) return setTriggerText(INFO_HIDE_TEXT);
						setTriggerText(INFO_TRIGGER_TEXT);
					}}
				>
					<span className='inline'>
						<CollapsibleContent>{INFO_TEXT}</CollapsibleContent>
						<CollapsibleTrigger>{triggerText}</CollapsibleTrigger>
					</span>
				</Collapsible>
			</div>
		</div>
	);
};

export default ProtectionCard;
