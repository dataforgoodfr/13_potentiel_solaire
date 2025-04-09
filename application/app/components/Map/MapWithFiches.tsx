'use client';

import { useState } from 'react';

//import { useRouter } from 'next/router';

import { EtablissementFeature } from '@/app/models/etablissements';

import useSelectedTerritoires from '../../utils/hooks/useSelectedTerritories';
import Fiches from '../fiches/Fiches';
import FranceMap from './FranceMap';

export default function MapWithFiches() {
	//const router = useRouter();
	const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementFeature | null>(
		null,
	);
	const { commune, departement, region } = useSelectedTerritoires(selectedEtablissement);

	// useEffect(() => {
	// 	const { etablissementId } = router.query;

	// 	if (etablissementId) {
	// 		// Récupérer l'établissement correspondant à l'ID dans l'URL
	// 		// Remplacer cette ligne par la logique pour récupérer un établissement depuis une base de données ou un état global
	// 		const etablissement = getEtablissementById(etablissementId as string);
	// 		setSelectedEtablissement(etablissement || null);
	// 	}
	// }, [router.query]);

	// const getEtablissementById = (id: string): EtablissementFeature | null => {
	// 	// Logique fictive pour récupérer un établissement, à adapter en fonction de l'architecture de ton application
	// 	const dummyEtablissements = [
	// 		{
	// 			id: '123',
	// 			properties: { nom: 'Etablissement 123' },
	// 			geometry: { coordinates: [0, 0] },
	// 		},
	// 		// Ajoute ici d'autres établissements ou récupère depuis un état global
	// 	];
	// 	return dummyEtablissements.find((etab) => etab.id === id) || null;
	// };

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex-1'>
				<FranceMap onSelect={setSelectedEtablissement} />
			</div>
			{selectedEtablissement && (
				<Fiches
					etablissement={{
						...selectedEtablissement.properties,
						longitude: selectedEtablissement.geometry.coordinates[0],
						latitude: selectedEtablissement.geometry.coordinates[1],
					}}
					commune={commune ?? undefined}
					departement={departement ?? undefined}
					region={region ?? undefined}
					onClose={() => setSelectedEtablissement(null)}
				/>
			)}
		</div>
	);
}
