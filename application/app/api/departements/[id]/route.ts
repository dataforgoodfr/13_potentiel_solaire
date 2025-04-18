import { NextRequest } from 'next/server';

import { fetchDepartementById } from '@/app/lib/data';

/**
 * Get departement by id.
 * @param request
 * @returns
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	try {
		const data = await fetchDepartementById(id);
		if (!data) {
			return Response.json({ message: 'Departement not found' }, { status: 404 });
		}
		return Response.json(data, { status: 200 });
	} catch (error) {
		console.error('Error while retrieving data:', error);
		return Response.json({ error }, { status: 500 });
	}
}
