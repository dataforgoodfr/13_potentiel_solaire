import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SetIsOpen = (value: boolean) => void;

type ReturnType = [boolean, SetIsOpen];

function toBoolean(value: string | null) {
	return value === 'true';
}

const KEY = 'isFicheOpen';

export default function useIsFicheOpen(): ReturnType {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const setIsOpen: SetIsOpen = useCallback(
		(value) => {
			const newParams = new URLSearchParams(searchParams);

			if (value) {
				newParams.set(KEY, value.toString());
			} else {
				newParams.delete(KEY);
			}

			router.push(`${pathname}?${newParams.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const isOpen = toBoolean(searchParams.get(KEY));

	return [isOpen, setIsOpen];
}
