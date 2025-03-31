const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function getBaseURL() {
	if (baseURL === undefined) {
		throw new Error('Base URL is not defined, check your .env');
	}

	return baseURL;
}
