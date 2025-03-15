'use client';

import { useRef } from 'react';

import { CommunesGeoJSON } from '@/app/models/communes';
import type {
	LngLatLike,
	MapMouseEvent,
	MapProps as MapPropsReactMapLibre,
	MapRef,
} from '@vis.gl/react-maplibre';
import { Layer, Map as MapFromReactMapLibre, Source } from '@vis.gl/react-maplibre';
import { type GeoJSONSource } from 'maplibre-gl';

import { EtablissementsGeoJSON } from '../../models/etablissements';
import { COMMUNES_SOURCE_ID, communesLayer } from './communesLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	unclusteredPointLayer,
} from './etablissementsLayers';
import { ClusterFeature } from './interfaces';

const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const initialViewState: MapPropsReactMapLibre['initialViewState'] = {
	longitude: 1.888334,
	latitude: 46.603354,
	zoom: 4,
};

const style: React.CSSProperties = {
	width: 1200,
	height: 800,
};

type ClusterEtablissementFeature = ClusterFeature<
	EtablissementsGeoJSON['features'][number]['geometry']
>;

type MapProps = {
	etablissements: EtablissementsGeoJSON;
	communes: CommunesGeoJSON;
};

export function Map({ etablissements, communes }: MapProps) {
	const mapRef = useRef<MapRef>(null);

	const onClick = async (event: MapMouseEvent) => {
		if (!mapRef.current) return;

		const feature =
			event.features && (event.features[0] as unknown as ClusterEtablissementFeature);
		if (!feature || !('cluster_id' in feature.properties)) return;

		const clusterId = feature.properties.cluster_id;

		const geojsonSource = mapRef.current.getSource(ETABLISSEMENTS_SOURCE_ID) as GeoJSONSource;

		const zoom = await geojsonSource.getClusterExpansionZoom(clusterId);

		const { coordinates } = feature.geometry;

		if (coordinates.length !== 2) {
			throw new Error('The coordinates doesnt have a length of 2');
		}

		mapRef.current.easeTo({
			center: coordinates as LngLatLike,
			zoom,
			duration: 500,
		});
	};

	if (!clusterLayer.id) {
		throw new Error('Layer not defined');
	}

	return (
		<>
			<MapFromReactMapLibre
				ref={mapRef}
				style={style}
				initialViewState={initialViewState}
				mapStyle={MAP_STYLE_URL}
				interactiveLayerIds={[clusterLayer.id]}
				onClick={onClick}
			>
				<Source id={COMMUNES_SOURCE_ID} type='geojson' data={communes}>
					<Layer {...communesLayer} />
				</Source>
				<Source
					id={ETABLISSEMENTS_SOURCE_ID}
					type='geojson'
					data={etablissements}
					cluster={true}
					clusterMaxZoom={14}
					clusterRadius={50}
				>
					<Layer {...clusterLayer} />
					<Layer {...clusterCountLayer} />
					<Layer {...unclusteredPointLayer} />
				</Source>
			</MapFromReactMapLibre>
		</>
	);
}
