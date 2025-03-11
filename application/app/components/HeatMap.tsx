'use client';

import type {
	HeatmapLayerSpecification,
	LineLayerSpecification,
	MapProps,
} from 'react-map-gl/maplibre';
import Map, {
	FullscreenControl,
	GeolocateControl,
	Layer,
	NavigationControl,
	ScaleControl,
	Source,
} from 'react-map-gl/maplibre';

import 'maplibre-gl/dist/maplibre-gl.css';

import ControlPanel from './ControlPanel';

const communesLayer: LineLayerSpecification = {
	id: 'communes-layer',
	type: 'line',
	source: 'line-source',
	layout: {
		'line-join': 'round',
		'line-cap': 'round',
	},
	paint: {
		'line-color': 'black',
		'line-width': 1,
	},
};

const heatMapLayer: HeatmapLayerSpecification = {
	id: 'etablissements-layer',
	type: 'heatmap',
	source: 'point-source',
	paint: {
		'heatmap-radius': 10,
		'heatmap-color': [
			'step',
			['heatmap-density'],
			'rgba(33,102,172,0)',
			0.05,
			'rgba(103,169,207,0.1)',
			0.15,
			'rgba(209,229,240,0.3)',
			0.3,
			'rgba(253,219,199,0.5)',
			0.5,
			'rgba(239,138,98,0.7)',
			0.7,
			'rgba(178,24,43,0.8)',
			1,
			'rgba(103,0,13,1)',
		],
	},
};

const initialViewState: MapProps['initialViewState'] = {
	longitude: 1.888334,
	latitude: 46.603354,
	zoom: 4,
};

const style: React.CSSProperties = {
	width: 1200,
	height: 800,
};

const mapStyle = process.env.NEXT_PUBLIC_MAPTILER_STYLE_URL;

export default function HeatMap() {
	return (
		<>
			<Map initialViewState={initialViewState} style={style} mapStyle={mapStyle}>
				<GeolocateControl position='top-left' />
				<FullscreenControl position='top-left' />
				<NavigationControl position='top-left' />
				<ScaleControl />
				<Source id='communes-source' type='geojson' data='/data/communes.geojson'>
					<Layer {...communesLayer} />
				</Source>
				<Source
					id='etablissements-source'
					type='geojson'
					data='/data/etablissements.geojson'
				>
					<Layer {...heatMapLayer} />
				</Source>
			</Map>
			<ControlPanel />
		</>
	);
}
