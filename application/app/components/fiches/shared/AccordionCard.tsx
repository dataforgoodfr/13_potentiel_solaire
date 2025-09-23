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
	printOpen?: boolean;
	contentCss?: string;
	id?: string;
}

export default function AccordionCard({ actions, printOpen, contentCss, id }: AccordionCardProps) {
	return (
		<div className='accordion-wrapper' id={id}>
			{actions.map((action, index) => (
				<CollapsibleItem
					key={index}
					action={action}
					printOpen={printOpen}
					contentCss={contentCss}
				/>
			))}
		</div>
	);
}

function CollapsibleItem({
	action,
	printOpen = false,
	contentCss,
}: {
	action: { title: ReactNode | string; content: ReactNode };
	printOpen?: boolean;
	contentCss?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible
			open={printOpen || open}
			onOpenChange={setOpen}
			className='mb-2 rounded-md border border-blue bg-darkgrey p-2 text-sm text-white'
		>
			<CollapsibleTrigger className='flex w-full items-center justify-between px-4 py-2 text-sm font-bold'>
				<span className='pe-4 text-start'>{action.title}</span>
				<CollapsibleIcon open={open} />
			</CollapsibleTrigger>
			<CollapsibleContent className={`mt-2 block px-4 ${contentCss}`}>
				{action.content}
			</CollapsibleContent>
		</Collapsible>
	);
}

function CollapsibleIcon({ open }: { open: boolean }) {
	return open ? (
		<SquareMinus
			aria-hidden='true'
			focusable='false'
			className='h-5 w-5 shrink-0 stroke-green'
		/>
	) : (
		<SquarePlus
			aria-hidden='true'
			focusable='false'
			className='h-5 w-5 shrink-0 stroke-green'
		/>
	);
}
