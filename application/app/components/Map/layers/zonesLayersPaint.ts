import { FillLayerSpecification } from 'maplibre-gl';

export const zonesLayerPaint = {
	'fill-color': [
		'interpolate',
		['linear'],
		['get', 'potentiel_solaire'],
		0,
		'white',
		1000000,
		'yellow',
	],
	'fill-opacity': 0.9,
	'fill-outline-color': 'black',
} satisfies FillLayerSpecification['paint'];
