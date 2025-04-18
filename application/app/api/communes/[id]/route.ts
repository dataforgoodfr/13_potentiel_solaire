import { NextRequest } from 'next/server';

import { fetchCommuneById } from '@/app/lib/data';

/**
 * Get commune by id.
 * @param request
 * @returns
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	try {
		const data = await fetchCommuneById(id);
		if (!data) {
			return Response.json({ message: 'Commune not found' }, { status: 404 });
		}
		return Response.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
