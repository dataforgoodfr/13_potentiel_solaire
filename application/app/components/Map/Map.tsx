'use client';

import { useRef } from 'react';
import {
	Layer,
	LngLatLike,
	Map as MapFromReactMapLibre,
	MapMouseEvent,
	MapProps as MapPropsReactMapLibre,
	MapRef,
	Source,
} from 'react-map-gl/maplibre';

import { CommunesGeoJSON } from '@/app/models/communes';
import { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { EtablissementsGeoJSON } from '../../models/etablissements';
import { COMMUNES_SOURCE_ID, communesLayer } from './communesLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	unclusteredPointLayer,
} from './etablissementsLayers';
import { ClusterFeature } from './interfaces';

const MAP_STYLE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/map-styles/map-style.json`;

// TODO: Respecter les conditions de réutilisation des données Etalab
// - Mentionner la source des données (Etalab)
// - Indiquer la date de mise à jour du fichier map-style.json
// - Vérifier et respecter la licence (Licence Ouverte 2.0 ou ODbL)

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

export default function Map({ etablissements, communes }: MapProps) {
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
		<MapFromReactMapLibre
			ref={mapRef}
			initialViewState={initialViewState}
			mapStyle={MAP_STYLE_URL}
			interactiveLayerIds={[clusterLayer.id]}
			style={style}
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
	);
}
