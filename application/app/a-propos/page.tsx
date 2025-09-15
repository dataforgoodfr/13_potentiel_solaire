'use client';

import Image from 'next/image';

import dataForGoodImgSrc from '../../public/images/dataForGoodLong.svg';
import greenpeaceImgSrc from '../../public/images/greenpeaceLong.svg';
import kidsImgSrc from '../../public/images/kids.svg';
import StaticPage from '../components/StaticPage';
import aProposContent from '../components/content/a-propos';
import { A_PROPOS_DATA_FOR_GOOD, A_PROPOS_GREENPEACE } from '../components/content/a-propos';
import AccordionCard from '../components/fiches/shared/AccordionCard';

const contentStyle = 'px-4 pb-4 leading-relaxed tracking-normal text-sol_ko';

const actionsLong = [
	{
		title: (
			<Image
				src={greenpeaceImgSrc}
				alt='Logo de Greenpeace'
				width={261}
				height={37}
				className='h-12 w-auto object-contain'
			/>
		),
		content: <div className={contentStyle}>{A_PROPOS_GREENPEACE}</div>,
	},
	{
		title: (
			<Image
				src={dataForGoodImgSrc}
				alt='Logo de Data for good'
				width={126}
				height={48}
				style={{ borderRadius: '30px' }}
				className='h-12 w-auto object-contain'
			/>
		),
		content: <div className={`${contentStyle} pb-8`}>{A_PROPOS_DATA_FOR_GOOD}</div>,
	},
];

export default function AProposPage() {
	return (
		<div className='mx-auto max-w-5xl px-4 py-8 pb-40'>
			<div className='flex flex-col gap-6 md:flex-row'>
				<div className='order-2 flex-1 md:order-1'>
					<StaticPage
						{...aProposContent}
						media={
							<div className='block md:hidden'>
								<Image
									src={kidsImgSrc}
									alt='groupe d‘enfants sous le soleil'
									className='mt-8 h-auto w-full rounded-2xl object-contain'
									width={455}
									height={250}
								/>
							</div>
						}
					/>
				</div>

				<div className='order-1 mt-8 hidden flex-1 shrink md:order-2 md:ml-10 md:mt-24 md:block'>
					<Image
						src={kidsImgSrc}
						alt='groupe d‘enfants sous le soleil'
						className='h-auto w-full rounded-2xl object-contain'
						width={455}
						height={250}
					/>
				</div>
			</div>

			<AccordionCard actions={actionsLong} />
		</div>
	);
}
