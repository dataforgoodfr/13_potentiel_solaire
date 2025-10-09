import useSWRImmutable from 'swr/immutable';

import { fetchContactMairie } from '../fetchers/fetchContactMairie';

export default function useContactMairie(codeCommune: string | null) {
	const key = codeCommune ? ['contactMairie', codeCommune] : null;
	const { data, error, ...responseRest } = useSWRImmutable(key, () =>
		fetchContactMairie(codeCommune!),
	);

	return {
		contactMairie: data,
		isError: error,
		isFetching: responseRest.isLoading && responseRest.isValidating,
		...responseRest,
	};
}
