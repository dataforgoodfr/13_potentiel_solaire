import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import {
	ACTIVE_TAB_KEY,
	CODE_COMMUNES_KEY,
	CODE_DEPARTEMENTS_KEY,
	CODE_ETABLISSEMENTS_KEY,
	CODE_REGIONS_KEY,
	CODE_TO_TAB_ID_MAP,
	codesDiffer,
	getLongestValidHierarchy,
	isTabValid,
} from './app/utils/state-utils';

/**
 * Handle requests to the root path '/'.
 * If one of the codes are missing following the hierarchy, or if the activeTab is not consistent with the last valid code,
 * redirect to the same path with the longest valid hierarchy of codes and the corresponding activeTab.
 * It avoids having unstable states in the application.
 * @param request
 * @returns
 */
export function middleware(request: NextRequest) {
	const paramsClone = new URLSearchParams(request.nextUrl.searchParams);
	const codeRegion = paramsClone.get(CODE_REGIONS_KEY);
	const codeDepartement = paramsClone.get(CODE_DEPARTEMENTS_KEY);
	const codeCommune = paramsClone.get(CODE_COMMUNES_KEY);
	const codeEtablissement = paramsClone.get(CODE_ETABLISSEMENTS_KEY);
	const activeTabParam = paramsClone.get(ACTIVE_TAB_KEY);

	const currentHierarchy = {
		codeRegion,
		codeDepartement,
		codeCommune,
		codeEtablissement,
	};

	const [longestValidHierarchy, lastValidLevel] = getLongestValidHierarchy(currentHierarchy);
	const invalidActiveTab =
		activeTabParam !== null && !isTabValid(activeTabParam, longestValidHierarchy);

	if (codesDiffer(currentHierarchy, longestValidHierarchy) || invalidActiveTab) {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL must be set!');

		Object.entries(longestValidHierarchy)
			.filter(([_, value]) => value === null)
			.forEach(([key]) => {
				paramsClone.delete(key);
			});
		if (invalidActiveTab) {
			if (lastValidLevel !== null) {
				paramsClone.set(ACTIVE_TAB_KEY, CODE_TO_TAB_ID_MAP[lastValidLevel]);
			} else {
				paramsClone.delete(ACTIVE_TAB_KEY);
			}
		}

		return NextResponse.redirect(new URL(`/?${paramsClone.toString()}`, baseUrl));
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: '/',
};
