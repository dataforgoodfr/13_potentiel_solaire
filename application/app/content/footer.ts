/**
 * Footer links configuration.
 * Each link is an object with:
 * - title: The link text
 * - href: The link URL
 * - priority: The priority of the page for SEO sitemap (0.0 to 1.0)
 */
export const footerLinks = [
	{ title: 'Mentions légales', href: '/mention-legales', priority: 0.3 },
	{
		title: 'Politique de confidentialité',
		href: 'https://www.greenpeace.fr/politique-de-confidentialite/',
	},
	{
		title: 'Jeu de données ouvert',
		href: 'https://github.com/dataforgoodfr/13_potentiel_solaire',
	},
	{ title: 'Accessibilité du site', href: '/accessibilite-du-site', priority: 0.3 },
];

export const partners = [
	{
		name: 'Greenpeace',
		logo: '/images/greenpeace.svg',
		address: '13 rue d’Enghien',
		city: '75010 Paris',
		phone: '01 80 96 96 96',
	},
	{
		name: 'Data For Good',
		logo: '/images/DataForGood.svg',
		socials: [
			{ name: 'Site web', href: 'https://dataforgood.fr/' },
			{ name: 'Github', href: 'https://github.com/dataforgoodfr' },
			{ name: 'YouTube', href: 'https://www.youtube.com/channel/UCA_utdbmVhAOFujulWlaaCQ' },
			{ name: 'Twitch', href: 'https://www.twitch.tv/dataforgood' },
			{ name: 'Hugging Face', href: 'https://huggingface.co/DataForGood' },
			{ name: 'Meetup', href: 'https://www.meetup.com/data-for-good-fr/' },
		],
	},
];

export const footerText = {
	copyright: 'Tous droits réservés — © 2025 Greenpeace & Data for Good',
};

export const footerDescription = {
	title: 'Notre objectif',
	text: `L’outil Établissement Solaire permet d’évaluer le potentiel des toitures des établissements
scolaires publics français pour accueillir des panneaux solaires photovoltaïques. Interactif, avec des données accessibles et libres,
il permet d’aider les habitant·es et les collectivités locales à connaître le potentiel de leur territoire et à agir pour
développer les énergies renouvelables près de chez eux.`,
};
