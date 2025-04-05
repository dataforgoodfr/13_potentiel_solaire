'use client';

import { useRef, useState } from 'react';
import {
	Layer,
	LayerProps,
	LngLatLike,
	Map as MapFromReactMapLibre,
	MapMouseEvent,
	MapProps as MapPropsReactMapLibre,
	MapRef,
	Source,
	ViewStateChangeEvent,
} from 'react-map-gl/maplibre';

import { CommuneFeature } from '@/app/models/communes';
import { DepartementFeature } from '@/app/models/departements';
import { RegionFeature } from '@/app/models/regions';
import useCommunesGeoJSON from '@/app/utils/hooks/useCommunesGeoJSON';
import useDepartementsGeoJSON from '@/app/utils/hooks/useDepartementsGeoJSON';
import useEtablissementsGeoJSON from '@/app/utils/hooks/useEtablissementsGeoJSON';
import useRegionsGeoJSON from '@/app/utils/hooks/useRegionsGeoJSON';
import { bbox } from '@turf/turf';
import { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { EtablissementFeature, EtablissementsGeoJSON } from '../../models/etablissements';
import { ClusterFeature } from './interfaces';
import {
	COMMUNES_SOURCE_ID,
	communesLayer,
	communesTransparentLayer,
	getCommunesLabelLayer,
	getDynamicalCommunesLayer,
	getDynamicalCommunesLineLayer,
	getDynamicalCommunesTransparentLayer,
} from './layers/communesLayers';
import {
	DEPARTEMENTS_SOURCE_ID,
	departementsLayer,
	getDepartementsLabelLayer,
	getDynamicalDepartementsLayer,
} from './layers/departementsLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterLayer,
	getDynamicalClusterCountLayer,
	getDynamicalClusterLayer,
	getDynamicalUnclusteredPointLayer,
	unclusteredPointLayer,
} from './layers/etablissementsLayers';
import {
	REGIONS_SOURCE_ID,
	getDynamicalRegionsLayer,
	getRegionsLabelLayer,
	regionsLayer,
} from './layers/regionsLayers';

const MAP_STYLE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/map-styles/map-style.json`;

// TODO: Respecter les conditions de réutilisation des données Etalab
// - Mentionner la source des données (Etalab)
// - Indiquer la date de mise à jour du fichier map-style.json
// - Vérifier et respecter la licence (Licence Ouverte 2.0 ou ODbL)

const initialViewState = {
	longitude: 1.888334,
	latitude: 45.603354,
	zoom: 4.5,
} satisfies MapPropsReactMapLibre['initialViewState'];

const ANIMATION_TIME_MS = 800;

const ETABLISSEMENT_VISIBLE_ZOOM_THRESHOLD = 8;
const COMMUNES_VISIBLE_ZOOM_THRESHOLD = 7;
const DEPARTEMENTS_VISIBLE_ZOOM_THRESHOLD = 6;

type EventFeature<Feature extends GeoJSON.Feature = GeoJSON.Feature> = Feature & {
	layer: LayerProps;
	source: string;
};

type EventRegionFeature = EventFeature<RegionFeature>;
type EventDepartementFeature = EventFeature<DepartementFeature>;
type EventCommunesFeature = EventFeature<CommuneFeature>;

type ClusterEtablissementFeature = EventFeature<
	ClusterFeature<EtablissementsGeoJSON['features'][number]['geometry']>
>;

type EventEtablissementFeature = EventFeature<EtablissementFeature>;

interface FranceMapProps {
	onSelect: (feature: EtablissementFeature) => void;
}

/**
 * Type guard function that checks if the feature is from a layer
 * @param feature to check
 * @param layer the feature could be from
 * @returns
 */
function isFeatureFrom<T extends EventFeature>(
	feature: EventFeature | undefined,
	layer: LayerProps,
): feature is T {
	if (!feature) return false;

	return feature.layer.id === layer.id;
}

export default function FranceMap({ onSelect }: FranceMapProps) {
	const mapRef = useRef<MapRef>(null);
	const [currentZoom, setCurrentZoom] = useState(initialViewState.zoom);

	const [regionFeature, setRegionFeature] = useState<RegionFeature>();
	const [departementFeature, setDepartementFeature] = useState<DepartementFeature>();
	const [communeFeature, setCommuneFeature] = useState<CommuneFeature>();

	const codeRegion = regionFeature?.properties.code_region;
	const codeDepartement = departementFeature?.properties.code_departement;
	const codeCommune = communeFeature?.properties.code_commune;

	const { regionsGeoJSON, regionLabelPoints } = useRegionsGeoJSON();
	const { departementsGeoJSON, departementLabelPoints } = useDepartementsGeoJSON(
		codeRegion ?? null,
		codeRegion !== undefined,
	);
	const { communesGeoJSON, communeLabelPoints } = useCommunesGeoJSON(
		codeDepartement ?? null,
		codeDepartement !== undefined,
	);

	const { etablissementsGeoJSON } = useEtablissementsGeoJSON(
		codeCommune ?? null,
		codeCommune !== undefined,
	);

	async function zoomOnCluster(feature: ClusterEtablissementFeature) {
		if (!mapRef.current) return;

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
			duration: ANIMATION_TIME_MS,
		});
	}

	function zoomOnFeature(feature: CommuneFeature | DepartementFeature | RegionFeature) {
		if (!mapRef.current) return;

		const [minLng, minLat, maxLng, maxLat] = bbox(feature);

		mapRef.current.fitBounds(
			[
				[minLng, minLat],
				[maxLng, maxLat],
			],
			{ padding: 40, duration: ANIMATION_TIME_MS },
		);
	}

	async function handleClickOnRegion(feature: RegionFeature) {
		zoomOnFeature(feature);

		setRegionFeature(feature);
	}

	async function handleClickOnDepartement(feature: DepartementFeature) {
		zoomOnFeature(feature);

		setDepartementFeature(feature);
	}

	async function handleClickOnCommunes(feature: CommuneFeature) {
		zoomOnFeature(feature);

		setCommuneFeature(feature);
	}

	async function onClick(event: MapMouseEvent) {
		if (!mapRef.current || !event.features) return;

		const feature = event.features[0] as unknown as EventFeature;

		if (isFeatureFrom<EventRegionFeature>(feature, regionsLayer)) {
			handleClickOnRegion(feature);

			return;
		}

		if (isFeatureFrom<EventDepartementFeature>(feature, departementsLayer)) {
			handleClickOnDepartement(feature);

			return;
		}

		if (
			isFeatureFrom<EventCommunesFeature>(feature, communesLayer) ||
			isFeatureFrom<EventCommunesFeature>(feature, communesTransparentLayer)
		) {
			handleClickOnCommunes(feature);

			return;
		}

		if (isFeatureFrom<ClusterEtablissementFeature>(feature, clusterLayer)) {
			zoomOnCluster(feature);

			return;
		}

		if (
			isFeatureFrom<EventEtablissementFeature>(
				feature,
				getDynamicalUnclusteredPointLayer(true),
			)
		) {
			onSelect(feature);
			return;
		}
	}

	function handleZoom(event: ViewStateChangeEvent) {
		setCurrentZoom(event.viewState.zoom);
	}

	if (
		!clusterLayer.id ||
		!regionsLayer.id ||
		!departementsLayer.id ||
		!communesLayer.id ||
		!communesTransparentLayer.id
	) {
		throw new Error('Layers not defined');
	}

	const isRegionsLayerVisible = !codeRegion;
	const isDepartementsLayerVisible =
		Boolean(codeRegion) && currentZoom > DEPARTEMENTS_VISIBLE_ZOOM_THRESHOLD;
	const isCommunesLayerVisible =
		Boolean(codeDepartement) && currentZoom > COMMUNES_VISIBLE_ZOOM_THRESHOLD;
	const isEtablissementsLayerVisible =
		Boolean(codeCommune) && currentZoom > ETABLISSEMENT_VISIBLE_ZOOM_THRESHOLD;

	return (
		<MapFromReactMapLibre
			ref={mapRef}
			initialViewState={initialViewState}
			mapStyle={MAP_STYLE_URL}
			interactiveLayerIds={[
				regionsLayer.id,
				departementsLayer.id,
				communesLayer.id,
				communesTransparentLayer.id,
				clusterLayer.id,
				unclusteredPointLayer.id,
			]}
			onClick={onClick}
			onZoom={handleZoom}
		>
			{regionsGeoJSON && (
				<Source id={REGIONS_SOURCE_ID} type='geojson' data={regionsGeoJSON}>
					<Layer {...getDynamicalRegionsLayer(true)} />
					<Layer {...getRegionsLabelLayer(true)} />
				</Source>
			)}
			{regionLabelPoints && (
				<Source id='regions-labels' type='geojson' data={regionLabelPoints}>
					<Layer {...getRegionsLabelLayer(isRegionsLayerVisible)} />
				</Source>
			)}
			{departementsGeoJSON && (
				<Source id={DEPARTEMENTS_SOURCE_ID} type='geojson' data={departementsGeoJSON}>
					<Layer {...getDynamicalDepartementsLayer(isDepartementsLayerVisible)} />
					<Layer {...getDepartementsLabelLayer(isDepartementsLayerVisible)} />
				</Source>
			)}
			{departementLabelPoints && (
				<Source id='departements-labels' type='geojson' data={departementLabelPoints}>
					<Layer {...getDepartementsLabelLayer(isDepartementsLayerVisible)} />
				</Source>
			)}
			{communesGeoJSON && (
				<Source id={COMMUNES_SOURCE_ID} type='geojson' data={communesGeoJSON}>
					<Layer {...getDynamicalCommunesTransparentLayer(isCommunesLayerVisible)} />
					<Layer {...getDynamicalCommunesLineLayer(isCommunesLayerVisible)} />
					<Layer {...getDynamicalCommunesLayer(isCommunesLayerVisible)} />
					<Layer {...getCommunesLabelLayer(isCommunesLayerVisible)} />
				</Source>
			)}
			{communeLabelPoints && (
				<Source id='communes-labels' type='geojson' data={communeLabelPoints}>
					<Layer {...getCommunesLabelLayer(isCommunesLayerVisible)} />
				</Source>
			)}
			{etablissementsGeoJSON && (
				<Source
					id={ETABLISSEMENTS_SOURCE_ID}
					type='geojson'
					data={etablissementsGeoJSON}
					cluster={true}
					clusterMaxZoom={14}
					clusterRadius={50}
				>
					<Layer {...getDynamicalClusterLayer(isEtablissementsLayerVisible)} />
					<Layer {...getDynamicalClusterCountLayer(isEtablissementsLayerVisible)} />
					<Layer {...getDynamicalUnclusteredPointLayer(isEtablissementsLayerVisible)} />
				</Source>
			)}
		</MapFromReactMapLibre>
	);
}
