import { NextRequest, NextResponse } from 'next/server';

import { fetchEtablissement } from './app/utils/fetchers/fetchEtablissement';

export async function middleware(request: NextRequest) {
	const [, , idFromPath] = request.nextUrl.pathname.split('/');

	const etablissement = await fetchEtablissement(idFromPath).catch(() => {
		NextResponse.error();
	});

	if (etablissement) {
		const { code_region, code_departement, code_commune } = etablissement;
		return NextResponse.redirect(
			new URL(
				`/?codeRegion=${code_region}&codeDepartement=${code_departement}&codeCommune=${code_commune}&codeEtablissement=${idFromPath}&isFicheOpen=true`,
				request.url,
			),
		);
	}
}

export const config = {
	matcher: ['/etablissement/:path'],
};
