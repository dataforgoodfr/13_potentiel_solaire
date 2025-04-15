import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type Codes = {
	codeRegion: string | null;
	codeDepartement: string | null;
	codeCommune: string | null;
	codeEtablissement: string | null;
};

type SetCode = (key: keyof Codes, code: string | null) => void;
type SetCodes = (codes: Codes) => void;

type ReturnType = {
	values: Codes;
	setCode: SetCode;
	setCodes: SetCodes;
	reset: () => void;
};

export default function useURLParams(): ReturnType {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const setCode: SetCode = useCallback(
		(key, code) => {
			const newParams = new URLSearchParams(searchParams);

			if (code === null) {
				newParams.delete(key);
			} else {
				newParams.set(key, code.toString());
			}

			router.push(`${pathname}?${newParams.toString()}`);
		},
		[pathname, router, searchParams],
	);

	const setCodes: SetCodes = useCallback(
		(codes) => {
			const newParams = new URLSearchParams();

			const keys = Object.keys(codes) as unknown as (keyof Codes)[];

			keys.forEach((key) => {
				const code = codes[key];
				if (code === null) {
					newParams.delete(key);

					return;
				}
				newParams.set(key, code.toString());
			});

			router.push(`${pathname}?${newParams.toString()}`);
		},
		[pathname, router],
	);

	const reset = useCallback(() => {
		router.push(pathname);
	}, [pathname, router]);

	const values = {
		codeRegion: searchParams.get('codeRegion'),
		codeDepartement: searchParams.get('codeDepartement'),
		codeCommune: searchParams.get('codeCommune'),
		codeEtablissement: searchParams.get('codeEtablissement'),
	};

	return { values, setCode, setCodes, reset };
}
