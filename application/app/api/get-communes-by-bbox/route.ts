import { NextRequest } from 'next/server';

import { fetchCommunesFromBoundingBox } from '@/app/lib/data';

//TODO: remove later - just here for demo purpose
// an api route fetching data
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const swLat = searchParams.get('swLat');
	const swLng = searchParams.get('swLng');
	const neLat = searchParams.get('neLat');
	const neLng = searchParams.get('neLng');
	if (!swLat || !swLng || !neLat || !neLng) {
		return Response.json(
			{ message: 'Missing query parameter' },
			{
				status: 400,
			},
		);
	}
	try {
		const data = await fetchCommunesFromBoundingBox({
			southWest: { lat: Number(swLat), lng: Number(swLng) },
			northEast: { lat: Number(neLat), lng: Number(neLng) },
		});
		return Response.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
