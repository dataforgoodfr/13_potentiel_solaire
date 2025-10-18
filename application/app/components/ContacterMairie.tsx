import React, { useState } from 'react';
import { COMMENT_AGIR_PARTICULIER_FICHE, TEMPLATE_MAIL_ELU } from '../content/accordion-actions';
import { ContactMairie } from '../models/contact-mairie';
import { PopUp } from './fiches/shared/PopUp';

type ContacterMairieProps = {
	contact: ContactMairie | null;
};

function buildMailtoLink(email: string, subject: string, body: string) {
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContacterMairie({ contact }: ContacterMairieProps) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const content = COMMENT_AGIR_PARTICULIER_FICHE.BODY_CONTACT_ELU_ITEM;

	function openPopup() {
		setIsPopupOpen(true);
	}

	function closePopup() {
		setIsPopupOpen(false);
	}

	const normalizedEmail: string | undefined = contact?.email ?? undefined;

	const popupData = {
		email: normalizedEmail,
		subject: TEMPLATE_MAIL_ELU.SUBJECT,
		body: TEMPLATE_MAIL_ELU.BODY,
	};

	type Scenario = 'email' | 'formulaire' | 'site' | 'aucun';
	let scenario: Scenario = 'aucun';
	let buttonLabel = '';
	let linkHref = '';
	let alternativeText: React.ReactNode = '';
	let alternativeLinkText = '';

	if (contact?.email) {
		scenario = 'email';
		buttonLabel = content.MAIL_CONTACT.BUTTON_LABEL;
		linkHref = buildMailtoLink(contact.email, popupData.subject, popupData.body);
		alternativeText = content.MAIL_CONTACT.ALTERNATIVE;
		alternativeLinkText = content.MAIL_CONTACT.ALTERNATIVE_LINK_TEXT;
	} else if (contact?.url_contact) {
		scenario = 'formulaire';
		buttonLabel = content.SITE_FORM_CONTACT.BUTTON_LABEL;
		linkHref = contact.url_contact;
		alternativeText = content.SITE_FORM_CONTACT.ALTERNATIVE;
		alternativeLinkText = content.SITE_FORM_CONTACT.ALTERNATIVE_LINK_TEXT;
	} else if (contact?.url_site_mairie) {
		scenario = 'site';
		buttonLabel = content.SITE_CONTACT.BUTTON_LABEL;
		linkHref = contact.url_site_mairie;
		alternativeText = content.SITE_CONTACT.ALTERNATIVE;
		alternativeLinkText = content.SITE_CONTACT.ALTERNATIVE_LINK_TEXT;
	}

	if (scenario === 'aucun') {
		return <>{content.CONTACT_NOT_AVAILABLE}</>;
	}

	return (
		<>
			{content.CONTACT_AVAILABLE}

			<a
				href={linkHref}
				target={scenario === 'email' ? undefined : '_blank'}
				rel='noopener noreferrer'
				className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
			>
				{buttonLabel}
			</a>

			<p className='mt-3'>
				{alternativeText}&nbsp;
				<button
					onClick={openPopup}
					aria-haspopup='dialog'
					className='text-green underline decoration-dotted decoration-2 underline-offset-4'
				>
					{alternativeLinkText}
				</button>
				.
			</p>

			<PopUp
				isOpen={isPopupOpen}
				onClose={closePopup}
				subject={popupData.subject}
				body={popupData.body}
				{...(popupData.email ? { email: popupData.email } : {})}
			/>
		</>
	);
}
