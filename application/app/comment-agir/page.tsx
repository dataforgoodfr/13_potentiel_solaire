'use client';

import Image from 'next/image';

import commentagir from '../../public/images/comment-agir.png';
import StaticPage from '../components/StaticPage';
import {
	ELU_BODY,
	ELU_INTRO_LONG,
	PARTICULIER_BODY,
	PARTICULIER_INTRO_LONG,
} from '../components/content/accordion-actions';
import commentAgirContent from '../components/content/comment-agir';
import AccordionCard from '../components/fiches/shared/AccordionCard';

const actionsLong = [
	{
		title: 'Je suis un élu ou une élue et je veux agir',
		content: (
			<>
				{ELU_INTRO_LONG}
				{ELU_BODY}
			</>
		),
	},
	{
		title: 'Je suis un citoyen ou une citoyenne et je veux agir',
		content: (
			<>
				{PARTICULIER_INTRO_LONG}
				{PARTICULIER_BODY}
			</>
		),
	},
];

export default function CommentAgirPage() {
	return (
		<div className='mx-auto max-w-5xl px-4 py-8 pb-40'>
			<div className='flex flex-col gap-6 md:flex-row'>
				<div className='order-2 flex-1 md:order-1'>
					<StaticPage
						{...commentAgirContent}
						media={
							<div className='block md:hidden'>
								<Image
									src={commentagir}
									alt='école'
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
						src={commentagir}
						alt='école'
						className='h-auto w-full rounded-2xl object-contain'
						width={455}
						height={250}
					/>
				</div>
			</div>

			<AccordionCard actions={actionsLong} contentCss='text-sol_ko' />
		</div>
	);
}
