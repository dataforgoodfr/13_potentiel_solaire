'use client';

import { ReactNode, useState } from 'react';

import { SquareMinus, SquarePlus } from 'lucide-react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../../../../components/ui/collapsible';

interface AccordionCardProps {
	actions: {
		title: ReactNode;
		content: ReactNode;
	}[];
}

export default function AccordionCard({ actions }: AccordionCardProps) {
	return (
		<div>
			{actions.map((action, index) => (
				<CollapsibleItem key={index} action={action} />
			))}
		</div>
	);
}

function CollapsibleItem({
	action,
}: {
	action: { title: ReactNode | string; content: ReactNode };
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className='bg-darkgrey mb-2 rounded-md border border-blue p-2 text-sm text-white'
		>
			<CollapsibleTrigger className='flex w-full items-center justify-between px-4 py-2 text-sm font-bold'>
				<span className='text-start'>{action.title}</span>
				<CollapsibleIcon open={open} />
			</CollapsibleTrigger>
			<CollapsibleContent className='mt-2 block px-4'>{action.content}</CollapsibleContent>
		</Collapsible>
	);
}

function CollapsibleIcon({ open }: { open: boolean }) {
	return open ? (
		<SquareMinus className='h-5 w-5 shrink-0 stroke-green' />
	) : (
		<SquarePlus className='h-5 w-5 shrink-0 stroke-green' />
	);
}
