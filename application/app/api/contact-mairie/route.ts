import { NextRequest } from 'next/server';

import { fetchContactMairieByCommune } from '@/app/lib/data';

/**
 * Get contact mairie from a commune id.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const codeCommune = searchParams.get('codeCommune');

	if (!codeCommune) {
		return Response.json(
			{ message: 'Missing query parameter' },
			{
				status: 400,
			},
		);
	}

	try {
		const data = await fetchContactMairieByCommune(codeCommune);
		if (!data) {
			return Response.json({ message: 'Contact mairie not found' }, { status: 404 });
		}
		return Response.json(data, {
			status: 200,
		});
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
