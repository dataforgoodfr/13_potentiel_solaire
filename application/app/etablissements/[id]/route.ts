import { NextRequest, NextResponse } from 'next/server';

import { fetchEtablissementById } from '@/app/lib/data';
import { buildActiveTabParam, buildCodesParam } from '@/app/utils/state-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) throw new Error('NEXT_PUBLIC_BASE_URL must be set!');

	try {
		const etablissement = await fetchEtablissementById(id);
		if (etablissement) {
			const { code_region, code_departement, code_commune } = etablissement;
			const codesParams = buildCodesParam({
				codeRegion: code_region,
				codeDepartement: code_departement,
				codeCommune: code_commune,
				codeEtablissement: id,
			});
			const activeTabParam = buildActiveTabParam('etablissement');

			return NextResponse.redirect(
				new URL(`/?${codesParams.toString()}&${activeTabParam.toString()}`, baseUrl),
			);
		}
	} catch (e) {
		console.error('Error while fetching etablissement:', e);
		return NextResponse.error();
	}
}
