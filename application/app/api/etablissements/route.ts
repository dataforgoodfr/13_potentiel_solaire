import { NextRequest } from 'next/server';

import { fetchEtablissementsGeoJSON } from '@/app/lib/data';

/**
 * Get etablissements.
 * Get every etablissements if no code_commune is provided.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const codeCommune = searchParams.get('codeCommune');
	try {
		const data = await fetchEtablissementsGeoJSON(codeCommune);
		return Response.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
