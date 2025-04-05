import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
	callback: T,
	delay: number,
) {
	const timer = useRef<NodeJS.Timeout | null>(null);

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}

			timer.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);

	// Cleanup on unmount to clear the timer
	useEffect(() => {
		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, []);

	return debouncedCallback;
}
