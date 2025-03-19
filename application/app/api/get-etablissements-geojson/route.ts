import { NextResponse } from 'next/server';

import { fetchEtablissementsGeoJSON } from '@/app/lib/data';

/**
 * Get etablissements.
 * Get every etablissements if no code_commune is provided.
 * @param request
 * @returns
 */
export async function GET() {
	try {
		const data = await fetchEtablissementsGeoJSON();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
