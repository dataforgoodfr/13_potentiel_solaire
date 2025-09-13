'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import Image from 'next/image';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SquareMinus, SquarePlus } from 'lucide-react';

import StaticPage from '../components/StaticPage';
import aProposContent from '../components/content/a-propos';
import { A_PROPOS_DATA_FOR_GOOD, A_PROPOS_GREENPEACE } from '../components/content/a-propos';

const titleStyle = 'flex h-16 w-full items-center justify-between px-16';
const contentStyle = 'px-16 pb-4 leading-relaxed tracking-normal text-sol_ko';

const getActionsLong = (
	isOpen: boolean[],
	greenpeaceImgSrc: string,
	dataForGoodImgSrc: string,
	setGreenpeaceImgSrc: Dispatch<SetStateAction<string>>,
	setDataForGoodImgSrc: Dispatch<SetStateAction<string>>,
) => [
	{
		title: (
			<div className={titleStyle}>
				<Image
					src={greenpeaceImgSrc}
					alt='Logo de Greenpeace'
					width={261}
					height={37}
					className='h-16 w-auto object-contain'
					onError={() => setGreenpeaceImgSrc('/images/greenpeaceLong.png')}
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
					src={dataForGoodImgSrc}
					alt='Logo de Data for good'
					width={126}
					height={48}
					style={{ borderRadius: '30px' }}
					className='h-12 w-auto object-contain'
					onError={() => setDataForGoodImgSrc('/images/dataForGoodLong.png')}
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
	const [greenpeaceImgSrc, setGreenpeaceImgSrc] = useState<string>('/images/greenpeaceLong.webp');
	const [dataForGoodImgSrc, setDataForGoodImgSrc] = useState<string>(
		'/images/dataForGoodLong.webp',
	);
	return (
		<>
			<div className='mx-auto mb-24 flex max-w-6xl flex-col justify-evenly py-8'>
				<StaticPage {...aProposContent} />

				{getActionsLong(
					openStates,
					greenpeaceImgSrc,
					dataForGoodImgSrc,
					setGreenpeaceImgSrc,
					setDataForGoodImgSrc,
				).map((action, index) => (
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
							<CollapsibleTrigger className='flex w-full justify-between'>
								{action.title}
							</CollapsibleTrigger>
							<CollapsibleContent>{action.content}</CollapsibleContent>
						</span>
					</Collapsible>
				))}
			</div>
		</>
	);
}
