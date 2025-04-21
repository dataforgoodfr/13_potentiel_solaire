import useURLParams, { Codes } from '@/app/utils/hooks/useURLParams';

import { Layer, Level } from '../interfaces';

type URLValues = ReturnType<typeof useURLParams>['values'];

const initialState: Layer[] = [{ level: 'nation', code: '' }];

function mapURLToLayers(values: URLValues): Layer[] {
	const layers: Layer[] = [...initialState];
	const { codeRegion, codeDepartement, codeCommune, codeEtablissement } = values;

	if (codeRegion) layers.push({ level: 'region', code: codeRegion });
	if (codeDepartement) layers.push({ level: 'departement', code: codeDepartement });
	if (codeCommune) layers.push({ level: 'commune', code: codeCommune });
	if (codeEtablissement) layers.push({ level: 'etablissement', code: codeEtablissement });

	return layers;
}

function mapLayerLevelToCodeLabel(level: Level): keyof URLValues {
	if (level === 'region') return 'codeRegion';
	if (level === 'departement') return 'codeDepartement';
	if (level === 'commune') return 'codeCommune';
	if (level === 'etablissement') return 'codeEtablissement';

	throw new Error(`The level (${level}) does not exist`);
}

function mapLayersToCodes(layers: Layer[]) {
	const codes = layers.reduce(
		(obj, layer) => ({ ...obj, [mapLayerLevelToCodeLabel(layer.level)]: layer.code }),
		{},
	) as Codes;

	return codes;
}

/**
 * Hook that handle the layers for the map depending on the search params
 * @returns
 */
export default function useLayers() {
	const { values, setCode, setCodes, reset } = useURLParams();

	const layers = mapURLToLayers(values);
	const lastLayer = layers.slice(-1)[0];

	function addLayer(layer: Layer) {
		const { level, code } = layer;
		if (level === 'nation') return;

		const codeLabel = mapLayerLevelToCodeLabel(level);

		setCode(codeLabel, code);
	}

	function removeLayer() {
		const { level } = lastLayer;
		if (level === 'nation') return;

		const codeLabel = mapLayerLevelToCodeLabel(level);

		setCode(codeLabel, null);
	}

	function setLayers(layers: Layer[], isFicheOpen = false) {
		const codes = mapLayersToCodes(layers);

		setCodes(codes, isFicheOpen);
	}

	function resetLayer() {
		reset();
	}

	return {
		layers,
		lastLayer,
		addLayer,
		removeLayer,
		setLayers,
		resetLayer,
	};
}
