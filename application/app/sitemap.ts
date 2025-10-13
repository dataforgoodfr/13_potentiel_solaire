import type { MetadataRoute } from 'next';

import { footerLinks } from './content/footer';
import { navBarLinks } from './content/navBar';

const defaultPageChangeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';
const defaultPagePriority: MetadataRoute.Sitemap[number]['priority'] = 0.5;

function navBarSitemapElements(baseUrl: string): MetadataRoute.Sitemap {
	const filteredNavBarLinks = navBarLinks.filter((link) => link.href.startsWith('/'));
	return filteredNavBarLinks.map((link) => ({
		url: `${baseUrl}${link.href}`,
		changeFrequency: defaultPageChangeFrequency,
		priority: link.priority ?? defaultPagePriority,
	}));
}

function footerSitemapElements(baseUrl: string): MetadataRoute.Sitemap {
	const filteredFooterLinks = footerLinks.filter((link) => link.href.startsWith('/'));
	return filteredFooterLinks.map((link) => ({
		url: `${baseUrl}${link.href}`,
		changeFrequency: defaultPageChangeFrequency,
		priority: link.priority ?? defaultPagePriority,
	}));
}

/**
 * Uses NextJS convention to generate a "/sitemap.xml" special file, meant to be accessed by external search engines crawlers.
 * See :
 * - https://nextjs.org/docs/app/guides/production-checklist#metadata-and-seo
 * - https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 *
 * In the case of our webapp, pages are:
 * - Top-level static pages
 *   - NavBar pages
 *     - "Accueil"
 *     - "Comment agir ?"
 *     - "Notre méthodologie"
 *     - "À propos"
 *   - Footer pages
 *     - "Mentions légales"
 *     - "Accessibilité du site"
 *
 * Notes:
 * - "Google's limit is 50,000 URLs per sitemap" -> "For large web applications, you may need to split a sitemap into multiple files."
 *
 *
 * @returns This webapp's sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL must be set!');
	return [...navBarSitemapElements(baseUrl), ...footerSitemapElements(baseUrl)];
}
