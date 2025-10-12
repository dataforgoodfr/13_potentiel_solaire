import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL must be set!');
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				disallow: '/api/',
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
