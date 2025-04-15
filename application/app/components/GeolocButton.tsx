'use client';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { LocateFixed } from 'lucide-react';

import { CommuneFeature } from '../models/communes';
import { fetchCommuneFeatureWithGeoloc } from '../utils/fetchers/getCommuneGeolocGeoJSON';
import { getUserLocation } from '../utils/geoloc';
import { useDebouncedCallback } from '../utils/hooks/useDebouncedCallback';
import useURLParams, { Codes } from '../utils/hooks/useURLParams';

const DEBOUNCE_DELAY_MS = 500;

const GeolocButton: React.FC = () => {
	const { toast } = useToast();
	const { setCodes } = useURLParams();

	function setCommuneInURL(commune: CommuneFeature) {
		const codes: Codes = {
			codeRegion: commune.properties.code_region,
			codeDepartement: commune.properties.code_departement,
			codeCommune: commune.properties.code_commune,
			codeEtablissement: null,
		};

		setCodes(codes);
	}

	async function handleClick() {
		try {
			const { latitude, longitude } = await getUserLocation();
			const commune = await fetchCommuneFeatureWithGeoloc({
				lat: latitude,
				lng: longitude,
			});
			if (!commune) {
				throw new Error('Commune not found with geoloc data');
			}
			setCommuneInURL(commune);
		} catch {
			toast({
				title: 'Erreur lors de la géolocalisation',
				variant: 'destructive',
				action: (
					<ToastAction altText='Réssayer' onClick={() => handleClick()}>
						Réssayer
					</ToastAction>
				),
			});
		}
	}

	const debouncedHandleClick = useDebouncedCallback(handleClick, DEBOUNCE_DELAY_MS);

	return (
		<button
			className='bg-gray-500 hover:bg-gray-600 flex h-12 w-12 items-center justify-center rounded-full text-green'
			onClick={debouncedHandleClick}
		>
			<LocateFixed />
		</button>
	);
};

export default GeolocButton;
