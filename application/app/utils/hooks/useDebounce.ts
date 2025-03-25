import { useEffect, useState } from 'react';

const DEFAULT_DEBOUNCE_DELAY_MS = 500;

/**
 * Hook that debounce a value
 * @param value Value to debounce
 * @param delay Delay in ms of debouncing (default: 500)
 * @returns The debounced value
 */
export function useDebounce<T extends string | number>(
	value: T,
	delay = DEFAULT_DEBOUNCE_DELAY_MS,
) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
