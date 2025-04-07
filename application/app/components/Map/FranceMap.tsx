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

import { EtablissementFeature } from '../../models/etablissements';
import { ClusterFeature, Level } from './interfaces';
import {
	COMMUNES_SOURCE_ID,
	communesLayer,
	communesTransparentLayer,
	getDynamicalCommunesLayer,
	getDynamicalCommunesLineLayer,
	getDynamicalCommunesTransparentLayer,
} from './layers/communesLayers';
import {
	DEPARTEMENTS_SOURCE_ID,
	departementsLayer,
	getDynamicalDepartementsLayer,
} from './layers/departementsLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	unclusteredPointLayer,
} from './layers/etablissementsLayers';
import { REGIONS_SOURCE_ID, getDynamicalRegionsLayer, regionsLayer } from './layers/regionsLayers';

const MAP_STYLE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/map-styles/map-style.json`;

// TODO: Respecter les conditions de réutilisation des données Etalab
// - Mentionner la source des données (Etalab)
// - Indiquer la date de mise à jour du fichier map-style.json
// - Vérifier et respecter la licence (Licence Ouverte 2.0 ou ODbL)

const initialViewState = {
	longitude: 1.888334,
	latitude: 46.603354,
	zoom: 5,
} satisfies MapPropsReactMapLibre['initialViewState'];

const style: React.CSSProperties = {
	width: 1200,
	height: 800,
};

const ANIMATION_TIME_MS = 800;

const ETABLISSEMENT_VISIBLE_ZOOM_THRESHOLD = 11;
const COMMUNES_VISIBLE_ZOOM_THRESHOLD = 7;
const DEPARTEMENTS_VISIBLE_ZOOM_THRESHOLD = 6;

type EventFeature<Feature extends GeoJSON.Feature = GeoJSON.Feature> = Feature & {
	layer: LayerProps;
	source: string;
};

type EventRegionFeature = EventFeature<RegionFeature>;
type EventDepartementFeature = EventFeature<DepartementFeature>;
type EventCommunesFeature = EventFeature<CommuneFeature>;
type EventEtablissementFeature = EventFeature<EtablissementFeature>;
type ClusterEtablissementFeature = EventFeature<ClusterFeature<EtablissementFeature['geometry']>>;

interface FranceMapProps {
	onSelect: (feature: EtablissementFeature) => void;
	onLevelChange: (level: Level) => void;
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

export default function FranceMap({ onSelect, onLevelChange }: FranceMapProps) {
	const mapRef = useRef<MapRef>(null);
	const [currentZoom, setCurrentZoom] = useState(initialViewState.zoom);

	const [regionFeature, setRegionFeature] = useState<RegionFeature>();
	const [departementFeature, setDepartementFeature] = useState<DepartementFeature>();
	const [communeFeature, setCommuneFeature] = useState<CommuneFeature>();

	const codeRegion = regionFeature?.properties.code_region;
	const codeDepartement = departementFeature?.properties.code_departement;
	const codeCommune = communeFeature?.properties.code_commune;

	const { regionsGeoJSON } = useRegionsGeoJSON();
	const { departementsGeoJSON } = useDepartementsGeoJSON(
		codeRegion ?? null,
		codeRegion !== undefined,
	);
	const { communesGeoJSON } = useCommunesGeoJSON(
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

		if (isFeatureFrom<EventEtablissementFeature>(feature, unclusteredPointLayer)) {
			onSelect(feature);
			return;
		}
	}

	function isDepartementsLayerVisible(zoom: number) {
		return Boolean(codeRegion) && zoom > DEPARTEMENTS_VISIBLE_ZOOM_THRESHOLD;
	}
	function isCommunesLayerVisible(zoom: number) {
		return Boolean(codeDepartement) && zoom > COMMUNES_VISIBLE_ZOOM_THRESHOLD;
	}
	function isEtablissementsLayerVisible(zoom: number) {
		return Boolean(codeCommune) && zoom > ETABLISSEMENT_VISIBLE_ZOOM_THRESHOLD;
	}

	function handleZoom(event: ViewStateChangeEvent) {
		const { zoom } = event.viewState;
		setCurrentZoom(zoom);

		if (isEtablissementsLayerVisible(zoom)) {
			onLevelChange('etablissements');
			return;
		}

		if (isCommunesLayerVisible(zoom)) {
			onLevelChange('communes');
			return;
		}

		if (isDepartementsLayerVisible(zoom)) {
			onLevelChange('departements');
			return;
		}

		onLevelChange('regions');
	}

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
			style={style}
			onClick={onClick}
			onZoom={handleZoom}
		>
			{regionsGeoJSON && (
				<Source id={REGIONS_SOURCE_ID} type='geojson' data={regionsGeoJSON}>
					<Layer {...getDynamicalRegionsLayer(true)} />
				</Source>
			)}
			{departementsGeoJSON && (
				<Source id={DEPARTEMENTS_SOURCE_ID} type='geojson' data={departementsGeoJSON}>
					<Layer
						{...getDynamicalDepartementsLayer(isDepartementsLayerVisible(currentZoom))}
					/>
				</Source>
			)}
			{communesGeoJSON && (
				<Source id={COMMUNES_SOURCE_ID} type='geojson' data={communesGeoJSON}>
					<Layer
						{...getDynamicalCommunesTransparentLayer(
							isCommunesLayerVisible(currentZoom),
						)}
					/>
					<Layer
						{...getDynamicalCommunesLineLayer(isCommunesLayerVisible(currentZoom))}
					/>
					<Layer {...getDynamicalCommunesLayer(isCommunesLayerVisible(currentZoom))} />
				</Source>
			)}
			{etablissementsGeoJSON && isEtablissementsLayerVisible(currentZoom) && (
				<Source
					id={ETABLISSEMENTS_SOURCE_ID}
					type='geojson'
					data={etablissementsGeoJSON}
					cluster={true}
					clusterMaxZoom={14}
					clusterProperties={{
						potentiel_solaire: ['number', ['get', 'potentiel_solaire']],
					}}
				>
					<Layer {...clusterLayer} />
					<Layer {...clusterCountLayer} />
					<Layer {...unclusteredPointLayer} />
				</Source>
			)}
		</MapFromReactMapLibre>
	);
}
