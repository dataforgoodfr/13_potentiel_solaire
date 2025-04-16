/**
 * Feature type union.
 */
export type FeatureType = 'geoloc';

/**
 * Error class to report unsupported features.
 */
export class UnsupportedFeatureError extends Error {
	constructor(
		message: string,
		public type: FeatureType,
	) {
		super(message);
	}
}
