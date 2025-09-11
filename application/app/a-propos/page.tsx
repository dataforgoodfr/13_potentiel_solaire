'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SquareMinus, SquarePlus } from 'lucide-react';

import StaticPage from '../components/StaticPage';
import aProposContent from '../components/content/a-propos';
import { A_PROPOS_DATA_FOR_GOOD, A_PROPOS_GREENPEACE } from '../components/content/a-propos';

const titleStyle = 'flex h-16 w-full items-center justify-between px-16';
const contentStyle = 'px-16 pb-4 leading-relaxed tracking-normal text-sol_ko';

const getActionsLong = (isOpen: boolean[]) => [
	{
		title: (
			<div className={titleStyle}>
				<Image
					src='/images/greenpeaceLong.png'
					alt='Logo de Greenpeace'
					width={261}
					height={37}
					className='h-16 w-auto object-contain'
				/>
				{!isOpen[0] && <SquarePlus className='text-white' />}
				{isOpen[0] && <SquareMinus className='text-white' />}
			</div>
		),
		content: <div className={contentStyle}>{A_PROPOS_GREENPEACE}</div>,
	},
	{
		title: (
			<div className={titleStyle}>
				<Image
					src='/images/dataForGoodLong.png'
					alt='Logo de Data for good'
					width={126}
					height={48}
					style={{ borderRadius: '30px' }}
					className='h-12 w-auto object-contain'
				/>
				{!isOpen[1] && <SquarePlus className='text-white' />}
				{isOpen[1] && <SquareMinus className='text-white' />}
			</div>
		),
		content: <div className={`${contentStyle} pb-8`}>{A_PROPOS_DATA_FOR_GOOD}</div>,
	},
];

export default function AProposPage() {
	const [openStates, setOpenStates] = useState<boolean[]>([false, false]);
	return (
		<>
			<main className='mx-auto mb-24 flex max-w-6xl flex-col justify-evenly py-8'>
				<StaticPage {...aProposContent} />

				{getActionsLong(openStates).map((action, index) => (
					<Collapsible
						key={index}
						asChild
						defaultOpen={false}
						onOpenChange={(isOpen) => {
							const newStates = [...openStates];
							newStates[index] = isOpen;
							setOpenStates(newStates);
						}}
					>
						<span className='mb-4 w-full max-w-6xl bg-[#151528]'>
							<CollapsibleTrigger className="flex w-full justify-between">{action.title}</CollapsibleTrigger>
							<CollapsibleContent>{action.content}</CollapsibleContent>
						</span>
					</Collapsible>
				))}
			</main>
		</>
	);
}
