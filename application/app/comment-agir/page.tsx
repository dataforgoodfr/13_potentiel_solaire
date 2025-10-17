import { Metadata } from 'next';
import Image from 'next/image';

import commentagir from '../../public/images/comment-agir.png';
import StaticPage from '../components/StaticPage';
import AccordionCard from '../components/fiches/shared/AccordionCard';
import {
	COMMENT_AGIR_ELU_COMMON_BODY,
	COMMENT_AGIR_ELU_COMMON_TITLE,
	COMMENT_AGIR_ELU_PAGE_INTRO,
	COMMENT_AGIR_PARTICULIER_COMMON_BODY_CONTACT_ELU_ITEM,
	COMMENT_AGIR_PARTICULIER_COMMON_BODY_DECOUVRER_LES_PROJETS_ITEM,
	COMMENT_AGIR_PARTICULIER_COMMON_BODY_INTRO,
	COMMENT_AGIR_PARTICULIER_COMMON_BODY_SIGNER_PETITION_ITEM,
	COMMENT_AGIR_PARTICULIER_COMMON_TITLE,
	COMMENT_AGIR_PARTICULIER_PAGE_INTRO,
} from '../content/accordion-actions';
import commentAgirContent from '../content/comment-agir';
import { PAGE_COMMENT_AGIR_METADATA } from '../content/seo';

export const metadata: Metadata = PAGE_COMMENT_AGIR_METADATA;

const actionsLong = [
	{
		title: COMMENT_AGIR_ELU_COMMON_TITLE,
		content: (
			<>
				{COMMENT_AGIR_ELU_PAGE_INTRO}
				{COMMENT_AGIR_ELU_COMMON_BODY}
			</>
		),
	},
	{
		title: COMMENT_AGIR_PARTICULIER_COMMON_TITLE,
		content: (
			<>
				{COMMENT_AGIR_PARTICULIER_PAGE_INTRO}
				{COMMENT_AGIR_PARTICULIER_COMMON_BODY_INTRO}
				<ul className='mb-8 mt-2 list-inside list-disc space-y-8'>
					<li>{COMMENT_AGIR_PARTICULIER_COMMON_BODY_SIGNER_PETITION_ITEM}</li>
					<li>{COMMENT_AGIR_PARTICULIER_COMMON_BODY_CONTACT_ELU_ITEM}</li>
					<li>{COMMENT_AGIR_PARTICULIER_COMMON_BODY_DECOUVRER_LES_PROJETS_ITEM}</li>
				</ul>
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
									className='mb-6 h-auto w-full rounded-2xl object-contain'
									width={455}
									height={250}
								/>
							</div>
						}
					/>
				</div>

				<div className='order-1 hidden flex-1 shrink md:order-2 md:ml-10 md:mt-24 md:block'>
					<Image
						src={commentagir}
						alt='école'
						className='h-auto w-full rounded-2xl object-contain'
						width={455}
						height={250}
					/>
				</div>
			</div>

			<AccordionCard actions={actionsLong} contentCss='text-sol_ko text-base' />
		</div>
	);
}
