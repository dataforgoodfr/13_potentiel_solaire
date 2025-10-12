import type { MetadataRoute } from 'next';

import { footerLinks } from './content/footer';
import { navBarLinks } from './content/navBar';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000';
const defaultPageChangeFrequency = 'monthly';
const defaultPagePriority = 0.7;

function footerSitemapElements(): MetadataRoute.Sitemap {
	const filteredFooterLinks = footerLinks.filter(
		(link) => link.href && link.href.startsWith('/'),
	);
	return filteredFooterLinks.map((link) => ({
		url: `${baseUrl}${link.href}`,
		changeFrequency: defaultPageChangeFrequency,
		priority: 0.6,
	}));
}

function navBarSitemapElements(): MetadataRoute.Sitemap {
	const filteredNavBarLinks = navBarLinks.filter(
		(link) => link.href && link.href.startsWith('/'),
	);
	return filteredNavBarLinks.map((link) => ({
		url: `${baseUrl}${link.href}`,
		changeFrequency: defaultPageChangeFrequency,
		priority: defaultPagePriority,
	}));
}

/**
 * Uses NextJS convention to generate a "/sitemap.xml" special file, meant to be accessed by external search engines crawlers.
 * See :
 * - https://nextjs.org/docs/app/guides/production-checklist#metadata-and-seo
 * - https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * In the case of our webapp, pages are:
 * - Top-level static pages
 *   - NavBar pages (at the top right of the screen)
 *     - "Accueil"
 *     - "Comment agir ?"
 *     - "Notre méthodologie"
 *     - "À propos"
 *   - Footer pages (at the bottom of the screen, after click on arrow)
 *     - "Mentions légales"
 *     - "Accessibilité du site"
 * - Dynamic pages per city or school etc, with a hierarchy based on geographical level, each one having its own page. Each page can be distinguished by its URL after "?", and by a difference in the content of the right panel (which has a folded or unfolded state).
 *   - {Country}
 *     - {Region}
 *       - {Department}
 *         - {City}
 *           - {School}
 *
 * Possible improvements:
 * - Add a `lastModified` field, with a smart (precise or approximated with a heuristic/proxy?) value specific to each page
 * - Improve heuristic for `changeFrequency` field, possibly more individualized by page or by groups of pages
 *
 * Notes:
 * - "Google's limit is 50,000 URLs per sitemap" -> "For large web applications, you may need to split a sitemap into multiple files."
 *
 * @returns This webapp's sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		// home page
		{
			url: baseUrl,
			changeFrequency: defaultPageChangeFrequency,
			priority: 1,
		},
		...navBarSitemapElements(),
		...footerSitemapElements(),
		// TODO: Add dynamic pages
	];
}
