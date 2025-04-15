'use client';

import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { LocateFixed } from 'lucide-react';

import { CommuneFeature } from '../models/communes';
import { fetchCommuneGeoJSONWithGeoloc } from '../utils/fetchers/getCommuneGeolocGeoJSON';
import { getUserLocation } from '../utils/geoloc';
import { useDebouncedCallback } from '../utils/hooks/useDebouncedCallback';

type GeolocButtonProps = {
	onLocate: (geojson: CommuneFeature) => void;
};

const DEBOUNCE_DELAY_MS = 500;

const GeolocButton: React.FC<GeolocButtonProps> = ({ onLocate }) => {
	const { toast } = useToast();

	async function handleClick() {
		try {
			const { latitude, longitude } = await getUserLocation();
			const res = await fetchCommuneGeoJSONWithGeoloc({ lat: latitude, lng: longitude });
			if (!res) {
				throw new Error('Commune not found with geoloc data');
			}
			onLocate(res);
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
