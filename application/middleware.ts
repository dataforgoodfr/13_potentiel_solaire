import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import {
	CODE_COMMUNES_KEY,
	CODE_DEPARTEMENTS_KEY,
	CODE_ETABLISSEMENTS_KEY,
	CODE_REGIONS_KEY,
	codesDiffer,
	getLongestValidHierarchy,
} from './app/utils/state-utils';

export function middleware(request: NextRequest) {
	const paramsClone = new URLSearchParams(request.nextUrl.searchParams);
	const codeRegion = paramsClone.get(CODE_REGIONS_KEY);
	const codeDepartement = paramsClone.get(CODE_DEPARTEMENTS_KEY);
	const codeCommune = paramsClone.get(CODE_COMMUNES_KEY);
	const codeEtablissement = paramsClone.get(CODE_ETABLISSEMENTS_KEY);

	const currentHierarchy = {
		codeRegion,
		codeDepartement,
		codeCommune,
		codeEtablissement,
	};

	const longestValidHierarchy = getLongestValidHierarchy(currentHierarchy);

	if (codesDiffer(currentHierarchy, longestValidHierarchy)) {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL must be set!');

		Object.entries(longestValidHierarchy)
			.filter(([_, value]) => value === null)
			.forEach(([key, value]) => {
				if (value === null) {
					paramsClone.delete(key);
				}
			});
		return NextResponse.redirect(new URL(`/?${paramsClone.toString()}`, baseUrl));
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: '/',
};
