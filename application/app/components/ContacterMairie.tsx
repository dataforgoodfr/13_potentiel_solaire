import { COMMENT_AGIR_PARTICULIER_FICHE, TEMPLATE_MAIL_ELU } from '../content/accordion-actions';
import { ContactMairie } from '../models/contact-mairie';

type ContacterMairieProps = {
	contact: ContactMairie | null;
};

function buildMailtoLink(email: string, subject: string, body: string) {
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Component to display contact information.
 * 1. If email is available : button is a mailto link + alternative to copy content manually.
 * 2. If we have a contact form : button links to it + alternative to copy content manually.
 * 3. If we have a website : button links to it + alternative to copy content manually.
 * 4. If none of the above : we display a message indicating no contact info is available.
 * @param param0
 * @returns
 */
export default function ContacterMairie({ contact }: ContacterMairieProps) {
	const content = COMMENT_AGIR_PARTICULIER_FICHE.BODY_CONTACT_ELU_ITEM;

	if (contact?.email) {
		const mailtoLink = buildMailtoLink(
			contact.email,
			TEMPLATE_MAIL_ELU.SUBJECT,
			TEMPLATE_MAIL_ELU.BODY,
		);
		return (
			<>
				{content.CONTACT_AVAILABLE}
				<a
					href={mailtoLink}
					rel='noopener noreferrer'
					className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
				>
					{content.MAIL_CONTACT.BUTTON_LABEL}
				</a>
				<p className='mt-3'>
					{content.MAIL_CONTACT.ALTERNATIVE}&nbsp;
					{/* TODO: branch content copy popup  with email + subject + message*/}
					<button
						onClick={() => {
							console.log('copy content clicked for ', { contact });
						}}
						aria-haspopup='dialog'
						className='text-green underline decoration-dotted decoration-2 underline-offset-4'
					>
						{content.MAIL_CONTACT.ALTERNATIVE_LINK_TEXT}
					</button>
					.
				</p>
			</>
		);
	} else if (contact?.url_contact) {
		return (
			<>
				{content.CONTACT_AVAILABLE}
				<a
					href={contact.url_contact}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
				>
					{content.SITE_FORM_CONTACT.BUTTON_LABEL}
				</a>
				<p className='mt-3'>
					{content.SITE_FORM_CONTACT.ALTERNATIVE}&nbsp;
					{/* TODO: branch content copy popup with subject + message */}
					<button
						onClick={() => {
							console.log('copy content clicked for ', { contact });
						}}
						aria-haspopup='dialog'
						className='text-green underline decoration-dotted decoration-2 underline-offset-4'
					>
						{content.SITE_FORM_CONTACT.ALTERNATIVE_LINK_TEXT}
					</button>
					.
				</p>
			</>
		);
	} else if (contact?.url_site_mairie) {
		return (
			<>
				{content.CONTACT_AVAILABLE}
				<a
					href={contact.url_site_mairie}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-3 block w-full rounded-md bg-green px-4 py-2 text-center font-bold text-darkgreen'
				>
					{content.SITE_CONTACT.BUTTON_LABEL}
				</a>
				<p className='mt-3'>
					{content.SITE_CONTACT.ALTERNATIVE}&nbsp;
					{/* TODO: branch content copy popup  with subject + message */}
					<button
						onClick={() => {
							console.log('copy content clicked for ', { contact });
						}}
						aria-haspopup='dialog'
						className='text-green underline decoration-dotted decoration-2 underline-offset-4'
					>
						{content.SITE_CONTACT.ALTERNATIVE_LINK_TEXT}
					</button>
					.
				</p>
			</>
		);
	}
	return <>{content.CONTACT_NOT_AVAILABLE}</>;
}
