import { UnsupportedFeatureError } from './errors';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const GEOLOC_TIMEOUT = 5000;

const options: PositionOptions = {
	timeout: GEOLOC_TIMEOUT,
	maximumAge: ONE_DAY_MS,
	enableHighAccuracy: false,
};

/**
 * Get user location from browser api.
 * Use a timeout of 5 seconds.
 * The cache is used in one day interval.
 * We don't need high accuracy.
 * Throws an error if the browser doesn't support geolocation.
 * @returns
 */
export function getUserLocation(): Promise<GeolocationCoordinates> {
	return new Promise((resolve, reject) => {
		if (!('geolocation' in navigator)) {
			return reject(
				new UnsupportedFeatureError(
					'Geolocation is not supported by this browser.',
					'geoloc',
				),
			);
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				return resolve(position.coords);
			},
			(error) => reject(new Error(`Error getting location: ${error.message}`)),
			options,
		);
	});
}
