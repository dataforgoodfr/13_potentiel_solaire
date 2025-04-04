const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const options: PositionOptions = {
	timeout: 5000,
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
			return reject(new Error('Geolocation is not supported by this browser.'));
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
