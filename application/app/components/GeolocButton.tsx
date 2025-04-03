import { useCallback } from 'react';

import { LocateFixed } from 'lucide-react';

import { CommuneFeature } from '../models/communes';
import { fetchCommuneGeoJSONWithGeoloc } from '../utils/fetchers/getCommuneGeolocGeoJSON';
import { getUserLocation } from '../utils/geoloc';

type GeolocButtonProps = {
	onLocate: (geojson: CommuneFeature) => void;
};

const GeolocButton: React.FC<GeolocButtonProps> = ({ onLocate }) => {
	const handleClick = useCallback(async () => {
		//TODO: avoid multiple clicks callback (debounce)
		try {
			const { latitude, longitude } = await getUserLocation();
			const res = await fetchCommuneGeoJSONWithGeoloc({ lat: latitude, lng: longitude });
			if (!res) {
				throw new Error('Commune not found with geoloc data');
			}
			onLocate(res);
		} catch (error) {
			console.error('Error getting location:', error);
			//TODO: display error - toaster ?
		}
	}, [onLocate]);

	return (
		<button
			className='absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600'
			onClick={handleClick}
		>
			<LocateFixed />
		</button>
	);
};

export default GeolocButton;
