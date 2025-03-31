/**
 * Remove accents from a string by normalizing it.
 * @param str
 * @returns
 */
export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Sanitize a string by removing accents and extra spaces.
 * @param libelle
 * @returns
 */
export function sanitizeString(libelle: string) {
	// Step 1: Remove accents
	let sanitized = removeAccents(libelle);

	// Step 2: Replace any non-word characters (except spaces) with a space
	sanitized = sanitized.replace(/[^\w\s]/g, ' ');

	// Step 3: Replace multiple spaces with a single space
	return sanitized.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Returns true if the string matches the pattern for a code postal (i.e : only digits).
 * @param query
 * @returns
 */
export const isCodePostal = (query: string) => /^\d+$/.test(query);
