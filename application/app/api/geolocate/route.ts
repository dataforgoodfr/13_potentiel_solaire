import { NextRequest } from 'next/server';

import { fetchCommuneContainsLatLng } from '@/app/lib/data';

/**
 * Get enclosing commune from lat lng position.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	if (!lat || !lng) {
		return Response.json(
			{ message: 'Missing query parameter' },
			{
				status: 400,
			},
		);
	}
	if (isNaN(Number(lat)) || isNaN(Number(lng))) {
		return Response.json(
			{ message: 'Invalid query parameter' },
			{
				status: 400,
			},
		);
	}

	try {
		const data = await fetchCommuneContainsLatLng({
			lat: Number.parseFloat(lat),
			lng: Number.parseFloat(lng),
		});
		return Response.json(data, {
			status: 200,
		});
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
