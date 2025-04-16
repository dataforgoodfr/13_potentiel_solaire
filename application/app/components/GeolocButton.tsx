'use client';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { LocateFixed } from 'lucide-react';

import { CommuneFeature } from '../models/communes';
import { UnsupportedFeatureError } from '../utils/errors';
import { fetchCommuneFeatureWithGeoloc } from '../utils/fetchers/getCommuneGeolocGeoJSON';
import { GEOLOC_TIMEOUT, getUserLocation } from '../utils/geoloc';
import { useDebouncedCallback } from '../utils/hooks/useDebouncedCallback';
import useURLParams, { Codes } from '../utils/hooks/useURLParams';

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
		} catch (error) {
			if (error instanceof UnsupportedFeatureError && error.type === 'geoloc') {
				toast({
					title: "La géolocalisation n'est pas prise en charge par votre navigateur",
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Erreur lors de la géolocalisation',
					variant: 'destructive',
					action: (
						<ToastAction altText='Réssayer' onClick={handleClick}>
							Réessayer
						</ToastAction>
					),
				});
			}
		}
	}

	const debouncedHandleClick = useDebouncedCallback(handleClick, GEOLOC_TIMEOUT);

	return (
		<button
			type='button'
			className='text-green'
			aria-label='Utiliser la géolocalisation'
			onClick={debouncedHandleClick}
		>
			<LocateFixed size={24} />
		</button>
	);
};

export default GeolocButton;
