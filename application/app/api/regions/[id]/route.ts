import { NextRequest } from 'next/server';

import { fetchRegionById } from '@/app/lib/data';

/**
 * Get region by id.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	try {
		const data = await fetchRegionById(id);
		if (!data) {
			return Response.json({ message: 'Région not found' }, { status: 404 });
		}
		return Response.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
