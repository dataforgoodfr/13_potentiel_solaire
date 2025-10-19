import { Metadata } from 'next';

/**
 * Metadata common to all pages, used in RootLayout.
 * Template is used in child pages of the RootLayout (but not in the home page).
 * Can be overridden in specific pages.
 */
export const DEFAULT_METADATA: Metadata = {
	title: {
		template: '%s - Établissement Solaire',
		default: 'Établissement Solaire',
	},
	description:
		'Découvrez Établissement Solaire, l’outil qui révèle le potentiel solaire des toits d’écoles pour accélérer la transition énergétique locale.',
	openGraph: {
		title: 'Établissement Solaire – Accélérez la transition énergétique grâce aux toits des écoles',
		description:
			"Découvrez le potentiel solaire des toitures scolaires et participez à la transition énergétique de votre territoire avec l'outil Établissement Solaire.",
	},
};

/**
 * Metadata for "Comment agir ?" page
 */
export const PAGE_COMMENT_AGIR_METADATA: Metadata = {
	title: 'Comment agir ?',
};

/**
 *  Metadata for "À propos" page
 */
export const PAGE_A_PROPOS_METADATA: Metadata = {
	title: 'À propos',
};

/**
 * Metadata for "Méthodologie" page
 */
export const PAGE_METHODOLOGIE_METADATA: Metadata = {
	title: 'Notre méthodologie',
};

/**
 * Metadata for "Mentions légales" page
 */
export const PAGE_MENTIONS_LEGALES_METADATA: Metadata = {
	title: 'Mentions légales',
};
