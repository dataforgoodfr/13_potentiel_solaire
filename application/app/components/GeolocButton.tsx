'use client';

import { useState } from 'react';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Loader, LocateFixed } from 'lucide-react';

import { CommuneFeature } from '../models/communes';
import { UnsupportedFeatureError } from '../utils/errors';
import { fetchCommuneFeatureWithGeoloc } from '../utils/fetchers/getCommuneGeolocGeoJSON';
import { getUserLocation } from '../utils/geoloc';
import useURLParams, { Codes } from '../utils/hooks/useURLParams';
import { useInitialView } from '../utils/providers/initialViewProvider';

const GeolocButton: React.FC = () => {
	const { toast } = useToast();
	const { setCodes } = useURLParams();
	const [loading, setLoading] = useState(false);
	const { isInitialView, closeInitialView } = useInitialView();

	function setCommuneInURL(commune: CommuneFeature) {
		const codes: Codes = {
			codeRegion: commune.properties.code_region,
			codeDepartement: commune.properties.code_departement,
			codeCommune: commune.properties.code_commune,
			codeEtablissement: null,
		};

		setCodes(codes);
		if (isInitialView) closeInitialView();
	}

	async function handleClick() {
		if (loading) return;
		try {
			setLoading(true);
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
		} finally {
			setLoading(false);
		}
	}

	return (
		<button
			type='button'
			className='text-green hover:text-darkgreen'
			aria-label='Utiliser la géolocalisation'
			onClick={handleClick}
		>
			{loading ? <Loader className='animate-spin' size={24} /> : <LocateFixed size={24} />}
		</button>
	);
};

export default GeolocButton;
