/**
 * Feature type union.
 */
export type ErrorFeatureType = 'geoloc';

/**
 * Error class to report unsupported features.
 */
export class UnsupportedFeatureError extends Error {
	constructor(
		message: string,
		public type: ErrorFeatureType,
	) {
		super(message);
	}
}
