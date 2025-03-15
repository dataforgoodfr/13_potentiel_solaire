import type { LayerProps } from '@vis.gl/react-maplibre';

export const COMMUNES_SOURCE_ID = 'communes';

export const communesLayer: LayerProps = {
	id: 'communes',
	type: 'fill',
	source: COMMUNES_SOURCE_ID,
	paint: {
		'fill-color': [
			'interpolate',
			['linear'],
			['get', 'potentiel_solaire'],
			0,
			'black',
			200,
			'yellow',
		],
		'fill-opacity': 0.5,
	},
};
