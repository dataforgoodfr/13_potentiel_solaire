import useURLParams from '@/app/utils/hooks/useURLParams';

import { Layer, Level } from '../interfaces';

type URLValues = ReturnType<typeof useURLParams>['values'];

const initialState: Layer[] = [{ level: 'regions', code: '' }];

function mapURLToLayers(values: URLValues): Layer[] {
	const layers: Layer[] = [...initialState];
	const { codeRegion, codeDepartement, codeCommune } = values;

	if (codeRegion) layers.push({ level: 'departements', code: codeRegion });
	if (codeDepartement) layers.push({ level: 'communes', code: codeDepartement });
	if (codeCommune) layers.push({ level: 'etablissements', code: codeCommune });

	return layers;
}

function mapLayerLevelToCodeLabel(level: Level): keyof URLValues {
	if (level === 'departements') return 'codeRegion';
	if (level === 'communes') return 'codeDepartement';
	if (level === 'etablissements') return 'codeCommune';

	throw new Error(`The level (${level}) does not exist`);
}

function mapLayersToCodes(layers: Layer[]) {
	const codes = layers.reduce(
		(obj, layer) => ({ ...obj, [mapLayerLevelToCodeLabel(layer.level)]: layer.code }),
		{},
	) as Parameters<ReturnType<typeof useURLParams>['setCodes']>[0];

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
		if (level === 'regions') return;

		const codeLabel = mapLayerLevelToCodeLabel(level);

		setCode(codeLabel, code);
	}

	function removeLayer() {
		const { level } = lastLayer;
		if (level === 'regions') return;

		const codeLabel = mapLayerLevelToCodeLabel(level);

		setCode(codeLabel, null);
	}

	function setLayers(layers: Layer[]) {
		const codes = mapLayersToCodes(layers);

		setCodes(codes);
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
