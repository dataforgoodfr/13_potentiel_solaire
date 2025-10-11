import { ContactMairie } from '@/app/models/contact-mairie';

export const ANNUAIRE_ADMINISTRATION_TABLE = 'annuaire_administration';
/**
 * DB column names for the annuaire_administration table.
 */
export const ANNUAIRE_ADMINISTRATION_COLUMNS = {
	Id: 'code_commune',
	Nom: 'nom_commune',
	Email: 'email',
	UrlContact: 'url_contact',
	UrlSiteMairie: 'url_site_mairie',
} as const;

type AnnuaireAdministrationColumnValues =
	(typeof ANNUAIRE_ADMINISTRATION_COLUMNS)[keyof typeof ANNUAIRE_ADMINISTRATION_COLUMNS];

/**
 * Mapping of annuaire_administration columns to ContactMairie properties.
 */
export const CONTACT_MAIRIE_MAPPING = {
	[ANNUAIRE_ADMINISTRATION_COLUMNS.Id]: 'code_commune',
	[ANNUAIRE_ADMINISTRATION_COLUMNS.Nom]: 'nom_commune',
	[ANNUAIRE_ADMINISTRATION_COLUMNS.Email]: 'email',
	[ANNUAIRE_ADMINISTRATION_COLUMNS.UrlContact]: 'url_contact',
	[ANNUAIRE_ADMINISTRATION_COLUMNS.UrlSiteMairie]: 'url_site_mairie',
} as const satisfies Partial<{
	[K in AnnuaireAdministrationColumnValues]: keyof ContactMairie;
}>;
