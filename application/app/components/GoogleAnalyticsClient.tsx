'use client';

import { useEffect, useState } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';

const AVOID_HOSTNAMES = ['dataforgood.fr', 'localhost'];

/**
 * Wrapper around GoogleAnalytics component to only load it on production using client-side rendering.
 * @returns
 */
export default function GoogleAnalyticsClient() {
	const isProduction = process.env.NODE_ENV === 'production';
	const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
	const [skippingHost, setSkippingHost] = useState(true);

	useEffect(() => {
		const hostname = window.location.hostname;
		const shouldSkip = AVOID_HOSTNAMES.some((toAvoid) => hostname.includes(toAvoid));
		setSkippingHost(shouldSkip);

		if (!googleAnalyticsId) {
			console.warn('Google Analytics ID is not set');
		} else if (!isProduction) {
			console.warn('Google Analytics is disabled in non-production environment');
		} else if (shouldSkip) {
			console.warn(`Google Analytics is disabled for this hostname`);
		}
	}, [googleAnalyticsId, isProduction]);

	if (!googleAnalyticsId || !isProduction || skippingHost) return null;

	return <GoogleAnalytics gaId={googleAnalyticsId} />;
}
