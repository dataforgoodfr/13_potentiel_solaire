import { NextRequest } from 'next/server';

import { fetchSearchResults } from '@/app/lib/data';

/**
 * Get search results from a query.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('query');

	if (!query) {
		return Response.json(
			{ message: 'Missing query parameter' },
			{
				status: 400,
			},
		);
	}

	try {
		const data = await fetchSearchResults(query);
		return Response.json(data, {
			status: 200,
		});
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
