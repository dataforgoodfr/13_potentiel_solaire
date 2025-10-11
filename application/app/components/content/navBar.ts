/**
 * NavBar links configuration.
 * Each link is an object with:
 * - title: The link text
 * - href: The link URL
 * - priority: The priority of the page for SEO sitemap (0.0 to 1.0)
 */
export const navBarLinks: { title: string; href: string; priority: number }[] = [
	{ title: 'Accueil', href: '/', priority: 1 },
	{ title: 'Comment agir ?', href: '/comment-agir', priority: 0.8 },
	{ title: 'Notre méthodologie', href: '/methodologie', priority: 0.7 },
	{ title: 'À propos', href: '/a-propos', priority: 0.5 },
];

export default navBarLinks;
