'use client';

import * as React from 'react';
import { useRef } from 'react';
import type { MapMouseEvent, MapProps, MapRef } from 'react-map-gl/maplibre';
import Map, {
	FullscreenControl,
	GeolocateControl,
	Layer,
	NavigationControl,
	ScaleControl,
	Source,
} from 'react-map-gl/maplibre';

import type { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from './ClusterLayers';
import ControlPanel from './ControlPanel';

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

//TODO: fix type assertions
export default function ClusterMap() {
	const mapRef = useRef<MapRef>(null);

	const onClick = async (event: MapMouseEvent) => {
		const feature = event.features?.[0];
		if (!feature) {
			return;
		}
		const clusterId = feature.properties.cluster_id;

		const geojsonSource = mapRef.current!.getSource('etablissements') as GeoJSONSource;

		if (geojsonSource) {
			const zoom = await geojsonSource.getClusterExpansionZoom(clusterId);

			mapRef.current!.easeTo({
				center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
				zoom,
				duration: 500,
			});
		}
	};

	return (
		<>
			<Map
				initialViewState={initialViewState}
				style={style}
				mapStyle={mapStyle}
				interactiveLayerIds={[clusterLayer.id!]}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onClick={onClick}
				ref={mapRef}
			>
				<GeolocateControl position='top-left' />
				<FullscreenControl position='top-left' />
				<NavigationControl position='top-left' />
				<ScaleControl />
				<Source
					id='etablissements'
					type='geojson'
					data='/data/etablissements.geojson'
					cluster={true}
					clusterMaxZoom={14}
					clusterRadius={50}
				>
					<Layer {...clusterLayer} />
					<Layer {...clusterCountLayer} />
					<Layer {...unclusteredPointLayer} />
				</Source>
			</Map>
			<ControlPanel />
		</>
	);
}
