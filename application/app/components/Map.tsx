'use client';

import type {
	CircleLayerSpecification,
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

const etablissementsLayer: CircleLayerSpecification = {
	id: 'etablissements-layer',
	type: 'circle',
	source: 'point-source',
	paint: {
		'circle-radius': 3,
		'circle-color': 'blue',
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

export default function PotentielSolaireMap() {
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
					<Layer {...etablissementsLayer} />
				</Source>
			</Map>
			<ControlPanel />
		</>
	);
}
