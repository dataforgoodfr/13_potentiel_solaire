'use client';

import Image from 'next/image';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SquarePlus } from 'lucide-react';

import StaticPage from '../components/StaticPage';
import aProposContent from '../components/content/a-propos';
import {
	DATA_FOR_GOOD_TEXT,
	ELU_BODY,
	ELU_INTRO_LONG,
} from '../components/content/accordion-actions';

const actionsLong = [
	{
		title: (
			<div className='flex h-16 w-full items-center justify-between px-16'>
				<Image
					src='/images/greenpeaceLong.png'
					alt='Logo de Greenpeace'
					width={261}
					height={37}
					className='h-16 w-auto object-contain'
				/>
				<SquarePlus className='text-white' />
			</div>
		),
		content: (
			<div className='px-16 leading-relaxed tracking-normal text-sol_ko'>
				{ELU_INTRO_LONG}
				{ELU_BODY}
			</div>
		),
	},
	{
		title: (
			<div className='flex h-16 w-full items-center justify-between px-16'>
				<Image
					src='/images/dataForGoodLong.png'
					alt='Logo de Data for good'
					width={126}
					height={48}
					style={{ borderRadius: '30px' }}
					className='h-16 w-auto object-contain'
				/>
				<SquarePlus className='text-white' />
			</div>
		),
		content: <div className='px-16 leading-relaxed text-sol_ko'>{DATA_FOR_GOOD_TEXT}</div>,
	},
];

export default function CommentAgirPage() {
	return (
		<>
			<main className='mx-auto mb-24 flex max-w-6xl flex-col justify-evenly px-4 py-8'>
				<StaticPage {...aProposContent} />

				{actionsLong.map((action, index) => (
					<Collapsible
						key={index}
						asChild
						defaultOpen={false}
						onOpenChange={(isOpen) => {}}
					>
						<span className='mb-4 inline w-full max-w-6xl bg-[#151528]'>
							<CollapsibleTrigger>{action.title}</CollapsibleTrigger>
							<CollapsibleContent>{action.content}</CollapsibleContent>
						</span>
					</Collapsible>
				))}
			</main>
		</>
	);
}
