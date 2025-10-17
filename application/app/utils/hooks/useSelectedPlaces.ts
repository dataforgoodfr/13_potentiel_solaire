import useCommune from './useCommune';
import useContactMairie from './useContactMairie';
import useDepartement from './useDepartement';
import useEtablissement from './useEtablissement';
import useRegion from './useRegion';
import useURLParams from './useURLParams';

/**
 * Hook that returns the places (region, departement, commune, etablissement) based on url codes
 * @returns
 */
export default function useSelectedPlaces() {
	const {
		values: { codeRegion, codeDepartement, codeCommune, codeEtablissement },
	} = useURLParams();
	const { region, isFetching: isFetchingRegion } = useRegion(codeRegion);
	const { departement, isFetching: isFetchingDepartement } = useDepartement(codeDepartement);
	const { commune, isFetching: isFetchingCommune } = useCommune(codeCommune);
	const { etablissement, isFetching: isFetchingEtablissement } =
		useEtablissement(codeEtablissement);
	const { contactMairie, isFetching: isFetchingContactMairie } = useContactMairie(codeCommune);

	const isFetching =
		isFetchingRegion ||
		isFetchingDepartement ||
		isFetchingCommune ||
		isFetchingEtablissement ||
		isFetchingContactMairie;

	return {
		region,
		departement,
		commune,
		etablissement,
		contactMairie,
		isFetching,
	};
}
