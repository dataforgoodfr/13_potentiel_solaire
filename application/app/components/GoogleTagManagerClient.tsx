'use client';

import { useEffect, useState } from 'react';

import { GoogleTagManager } from '@next/third-parties/google';

const AVOID_HOSTNAMES = ['dataforgood.fr', 'localhost'];

/**
 * Wrapper around GoogleTagManager component to only load it on production using client-side rendering.
 * @returns
 */
export default function GoogleTagManagerClient() {
	const isProduction = process.env.NODE_ENV === 'production';
	const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
	const [skippingHost, setSkippingHost] = useState(true);

	useEffect(() => {
		const hostname = window.location.hostname;
		const shouldSkip = AVOID_HOSTNAMES.some((toAvoid) => hostname.includes(toAvoid));
		setSkippingHost(shouldSkip);

		if (!googleTagManagerId) {
			console.warn('Google Tag Manager ID is not set');
		} else if (!isProduction) {
			console.warn('Google Tag Manager is disabled in non-production environment');
		} else if (shouldSkip) {
			console.warn(`Google Tag Manager is disabled for this hostname`);
		}
	}, [googleTagManagerId, isProduction]);

	if (!googleTagManagerId || !isProduction || skippingHost) return null;

	return <GoogleTagManager gtmId={googleTagManagerId} />;
}
