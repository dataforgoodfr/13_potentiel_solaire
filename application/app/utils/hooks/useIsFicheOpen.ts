import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SetIsOpen = (value: boolean) => void;

type ReturnType = [boolean, SetIsOpen];

function toBoolean(value: string | null) {
	return value === 'true';
}

export const IS_FICHE_OPEN_KEY = 'isFicheOpen';

export default function useIsFicheOpen(): ReturnType {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const setIsOpen: SetIsOpen = useCallback(
		(value) => {
			const newParams = new URLSearchParams(searchParams);

			if (value) {
				newParams.set(IS_FICHE_OPEN_KEY, value.toString());
			} else {
				newParams.delete(IS_FICHE_OPEN_KEY);
			}

			router.push(`${pathname}?${newParams.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const isOpen = toBoolean(searchParams.get(IS_FICHE_OPEN_KEY));

	return [isOpen, setIsOpen];
}
