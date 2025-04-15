import useURLParams, { Codes } from '@/app/utils/hooks/useURLParams';

import { MenuDromLocation } from '../MenuDrom';

const HEXAGONE_LOCATION: MenuDromLocation = {
	name: 'hexagone',
	codeRegion: 'hexagone',
	codeDepartement: 'hexagone',
	icon: './DROMs/hexagone.svg',
};

export const MENU_DROM_LOCATIONS: MenuDromLocation[] = [
	{
		name: 'guadeloupe',
		codeRegion: '01',
		codeDepartement: '971',
		icon: './DROMs/guadeloupe.svg',
	},
	{
		name: 'martinique',
		codeRegion: '02',
		codeDepartement: '972',
		icon: './DROMs/martinique.svg',
	},
	{
		name: 'guyane',
		codeRegion: '03',
		codeDepartement: '973',
		icon: './DROMs/guyane.svg',
	},
	{
		name: 'reunion',
		codeRegion: '04',
		codeDepartement: '974',
		icon: './DROMs/reunion.svg',
	},
	{
		name: 'mayotte',
		codeRegion: '06',
		codeDepartement: '976',
		icon: './DROMs/mayotte.svg',
	},
	HEXAGONE_LOCATION,
];

export default function useMenuDrom() {
	const { values, setCodes, reset } = useURLParams();

	function handleClickMetropole() {
		reset();
	}

	function handleClickDrom(location: MenuDromLocation) {
		const codes: Codes = {
			codeRegion: location.codeRegion,
			codeDepartement: location.codeDepartement,
			codeCommune: null,
			codeEtablissement: null,
		};

		setCodes(codes);
	}

	const activeLocation =
		MENU_DROM_LOCATIONS.find((location) => location.codeRegion === values.codeRegion) ??
		HEXAGONE_LOCATION;

	return {
		activeLocation,
		handleClickMetropole,
		handleClickDrom,
	};
}
