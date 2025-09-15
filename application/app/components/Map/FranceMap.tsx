'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	LayerProps,
	Layer as LayerReactMapLibre,
	LngLatLike,
	Map as MapFromReactMapLibre,
	MapMouseEvent,
	MapProps as MapPropsReactMapLibre,
	MapRef,
	NavigationControl,
	Source,
} from 'react-map-gl/maplibre';

import { SelectedPlaces } from '@/app/models/common';
import { CommuneFeature } from '@/app/models/communes';
import { DepartementFeature } from '@/app/models/departements';
import { RegionFeature } from '@/app/models/regions';
import useActiveTab from '@/app/utils/hooks/useActiveTab';
import useCommunesGeoJSON from '@/app/utils/hooks/useCommunesGeoJSON';
import useDepartementsGeoJSON from '@/app/utils/hooks/useDepartementsGeoJSON';
import useEtablissementsGeoJSON from '@/app/utils/hooks/useEtablissementsGeoJSON';
import useRegionsGeoJSON from '@/app/utils/hooks/useRegionsGeoJSON';
import { getCurrentLevelItem } from '@/app/utils/level-utils';
import { bbox } from '@turf/turf';
import { EaseToOptions, GeoJSONSource, MapOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
	ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE,
	EtablissementFeature,
} from '../../models/etablissements';
import Loading from '../Loading';
import BackButton from './BackButton';
import CurrentLevel from './CurrentLevel';
import Legend from './Legend/Legend';
import MenuDrom from './MenuDrom';
import { COLOR_THRESHOLDS } from './constants';
import useLayers from './hooks/useLayers';
import { ClusterFeature, Layer, Level } from './interfaces';
import {
	COMMUNES_LABELS_SOURCE_ID,
	COMMUNES_SOURCE_ID,
	communesLabelsLayer,
	communesLayer,
	communesLineLayer,
	communesTransparentLayer,
} from './layers/communesLayers';
import {
	DEPARTEMENTS_LABELS_SOURCE_ID,
	DEPARTEMENTS_SOURCE_ID,
	departementsBackgroundLayer,
	departementsLabelsLayer,
	departementsLayer,
} from './layers/departementsLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	getUnclusteredPointLayer,
	getUnclusteredPointProtegeLayer,
	unclusteredPointProtegeIconLayer,
} from './layers/etablissementsLayers';
import {
	REGIONS_LABELS_SOURCE_ID,
	REGIONS_SOURCE_ID,
	regionsBackgroundLayer,
	regionsLabelsLayer,
	regionsLayer,
} from './layers/regionsLayers';

const MAP_STYLE_URL = `/map-styles/map-style.json`;

const MOBILE_VIEW_STATE = {
	longitude: 2.388334,
	latitude: 43.903354,
	zoom: 4.1,
} satisfies MapPropsReactMapLibre['initialViewState'];

const DESKTOP_VIEW_STATE = {
	longitude: 2.388334,
	latitude: 44.803354,
	zoom: 4.5,
} satisfies MapPropsReactMapLibre['initialViewState'];

const ANIMATION_TIME_MS = 800;

/**
 * These values passed as props to he maps are only init values (they can't be updated).
 */
const DEFAULT_ZOOM_CONSTRAINT = {
	minZoom: 4,
	maxZoom: 18,
} satisfies Partial<MapOptions>;

/**
 * Interactivity config options.
 * We deactivate rotating.
 * doubleClickZoom is disabled to avoid staggered zoom when combined with easeTo on click.
 */
const DEFAULT_INTERACTIVITY_CONFIG = {
	dragRotate: false,
	touchZoomRotate: false,
	doubleClickZoom: false,
} satisfies Partial<MapOptions>;

type EventFeature<Feature extends GeoJSON.Feature = GeoJSON.Feature> = Feature & {
	layer: LayerProps;
	source: string;
};

type EventRegionFeature = EventFeature<RegionFeature>;
type EventDepartementFeature = EventFeature<DepartementFeature>;
type EventCommuneFeature = EventFeature<CommuneFeature>;
type EventEtablissementFeature = EventFeature<EtablissementFeature>;
type ClusterEtablissementFeature = EventFeature<ClusterFeature<EtablissementFeature['geometry']>>;

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

interface FranceMapProps {
	selectedPlaces: SelectedPlaces;
}

export default function FranceMap({ selectedPlaces }: FranceMapProps) {
	const mapRef = useRef<MapRef>(null);
	const {
		layers,
		lastLayer: { level },
		removeLayer,
		setLayers,
	} = useLayers();
	const [isLoaded, setIsLoaded] = useState(false);
	const [, , setActiveTab] = useActiveTab();

	const isNationLevel = level === 'nation';
	const isRegionLevel = level === 'region';
	const isDepartementLevel = level === 'departement';
	const isCommuneLevel = level === 'commune';
	const isEtablissementLevel = level === 'etablissement';

	const currentLevelItem = getCurrentLevelItem(level, selectedPlaces);

	const codeRegion = layers.find((layer) => layer.level === 'region')?.code;
	const codeDepartement = layers.find((layer) => layer.level === 'departement')?.code;
	const codeCommune = layers.find((layer) => layer.level === 'commune')?.code;
	const codeEtablissement = layers.find((layer) => layer.level === 'etablissement')?.code;

	const {
		regionsGeoJSON,
		regionLabelPoints,
		isFetching: isRegionsGeoJSONLoading,
	} = useRegionsGeoJSON();
	const {
		departementsGeoJSON,
		departementLabelPoints,
		isFetching: isDepartementsGeoJSONFetching,
	} = useDepartementsGeoJSON(
		codeRegion ?? null,
		isLoaded && codeRegion != null && regionsGeoJSON != null,
	);
	const {
		communesGeoJSON,
		communeLabelPoints,
		isFetching: isCommunesGeoJSONFetching,
	} = useCommunesGeoJSON(
		codeDepartement ?? null,
		isLoaded && codeDepartement != null && departementsGeoJSON != null,
	);
	const { etablissementsGeoJSON, isFetching: isEtablissementsGeoJSONFetching } =
		useEtablissementsGeoJSON(
			codeCommune ?? null,
			isLoaded && codeCommune != null && communesGeoJSON != null,
		);

	const zoomOnActiveRegion = useCallback(() => {
		const activeRegion = regionsGeoJSON?.features.find(
			(feature) => feature.properties.code_region === codeRegion,
		);
		if (!activeRegion) return;

		zoomOnPolygonFeature(activeRegion);
	}, [codeRegion, regionsGeoJSON?.features]);
	const zoomOnActiveDepartement = useCallback(() => {
		const activeDepartement = departementsGeoJSON?.features.find(
			(feature) => feature.properties.code_departement === codeDepartement,
		);
		if (!activeDepartement) return;

		zoomOnPolygonFeature(activeDepartement);
	}, [codeDepartement, departementsGeoJSON?.features]);
	const zoomOnActiveCommune = useCallback(() => {
		const activeCommune = communesGeoJSON?.features.find(
			(feature) => feature.properties.code_commune === codeCommune,
		);
		if (!activeCommune) return;

		zoomOnPolygonFeature(activeCommune);
	}, [codeCommune, communesGeoJSON?.features]);
	const zoomOnActiveEtablissement = useCallback(() => {
		const activeEtablissement = etablissementsGeoJSON?.features.find(
			(feature) => feature.properties.identifiant_de_l_etablissement === codeEtablissement,
		);
		if (!activeEtablissement) return;

		zoomOnPointFeature(activeEtablissement);
	}, [codeEtablissement, etablissementsGeoJSON?.features]);

	function easeTo(options: EaseToOptions) {
		if (!mapRef.current) return;

		mapRef.current.easeTo({
			...options,
			duration: ANIMATION_TIME_MS,
		});
	}

	const easeToInitialView = useCallback(() => {
		const isDesktop = window.innerWidth >= 768;
		const view = isDesktop ? DESKTOP_VIEW_STATE : MOBILE_VIEW_STATE;

		easeTo({
			center: [view.longitude, view.latitude],
			zoom: view.zoom,
		});
	}, []);

	useEffect(() => {
		if (isEtablissementLevel) {
			zoomOnActiveEtablissement();

			return;
		}
		if (isCommuneLevel) {
			zoomOnActiveCommune();

			return;
		}
		if (isDepartementLevel) {
			zoomOnActiveDepartement();

			return;
		}
		if (isRegionLevel) {
			zoomOnActiveRegion();

			return;
		}

		easeToInitialView();
	}, [
		isDepartementLevel,
		isRegionLevel,
		isNationLevel,
		isCommuneLevel,
		zoomOnActiveCommune,
		zoomOnActiveDepartement,
		zoomOnActiveRegion,
		isEtablissementLevel,
		zoomOnActiveEtablissement,
		easeToInitialView,
	]);

	async function zoomOnCluster(feature: ClusterEtablissementFeature) {
		if (!mapRef.current) return;

		const clusterId = feature.properties.cluster_id;

		const geojsonSource = mapRef.current.getSource(ETABLISSEMENTS_SOURCE_ID) as GeoJSONSource;

		const zoom = await geojsonSource.getClusterExpansionZoom(clusterId);

		const { coordinates } = feature.geometry;

		if (coordinates.length !== 2) {
			throw new Error('The coordinates doesnt have a length of 2');
		}

		easeTo({
			center: coordinates as LngLatLike,
			zoom,
		});
	}

	function zoomOnPolygonFeature(feature: CommuneFeature | DepartementFeature | RegionFeature) {
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

	function zoomOnPointFeature(feature: EtablissementFeature) {
		if (!mapRef.current) return;

		easeTo({
			center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
			zoom: 16,
			duration: ANIMATION_TIME_MS,
		});
	}

	function getLayerUp(): Layer {
		return layers.slice(-2)[0];
	}
	function goBackOneLevel() {
		if (layers.length < 2) return;

		removeLayer();
	}

	const openFiche = useCallback(
		(level: Exclude<Level, 'nation'>) => {
			setActiveTab(level);
		},
		[setActiveTab],
	);

	async function handleClickOnRegion(feature: RegionFeature) {
		setLayers([{ code: feature.properties.code_region, level: 'region' }]);
	}
	async function handleClickOnDepartement(feature: DepartementFeature) {
		const newLayers: Layer[] = [
			{ code: feature.properties.code_region, level: 'region' },
			{ code: feature.properties.code_departement, level: 'departement' },
		];

		setLayers(newLayers);
	}
	async function handleClickOnCommune(feature: CommuneFeature) {
		const newLayers: Layer[] = [
			{ code: feature.properties.code_region, level: 'region' },
			{ code: feature.properties.code_departement, level: 'departement' },
			{ code: feature.properties.code_commune, level: 'commune' },
		];

		setLayers(newLayers);
	}
	async function handleClickOnEtablissement(feature: EtablissementFeature) {
		const newLayers: Layer[] = [
			{ code: feature.properties.code_region, level: 'region' },
			{ code: feature.properties.code_departement, level: 'departement' },
			{ code: feature.properties.code_commune, level: 'commune' },
			{ code: feature.properties.identifiant_de_l_etablissement, level: 'etablissement' },
		];

		setLayers(newLayers, 'etablissement');
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
			isFeatureFrom<EventCommuneFeature>(feature, communesLayer) ||
			isFeatureFrom<EventCommuneFeature>(feature, communesTransparentLayer)
		) {
			handleClickOnCommune(feature);

			return;
		}

		if (isFeatureFrom<ClusterEtablissementFeature>(feature, clusterLayer)) {
			zoomOnCluster(feature);

			return;
		}

		if (
			isFeatureFrom<EventEtablissementFeature>(feature, unclusteredPointLayer) ||
			isFeatureFrom<EventEtablissementFeature>(feature, unclusteredPointProtegeLayer)
		) {
			handleClickOnEtablissement(feature);

			return;
		}
	}

	const isLoading =
		isRegionsGeoJSONLoading ||
		isDepartementsGeoJSONFetching ||
		isCommunesGeoJSONFetching ||
		isEtablissementsGeoJSONFetching;

	const isEtablissementsLayerVisible = isCommuneLevel || isEtablissementLevel;

	const unclusteredPointLayer = useMemo(
		() => getUnclusteredPointLayer(codeEtablissement ?? null),
		[codeEtablissement],
	);

	const unclusteredPointProtegeLayer = useMemo(
		() => getUnclusteredPointProtegeLayer(codeEtablissement ?? null),
		[codeEtablissement],
	);

	return (
		<div className='relative flex h-full w-full flex-col'>
			<MapFromReactMapLibre
				ref={mapRef}
				initialViewState={MOBILE_VIEW_STATE}
				mapStyle={MAP_STYLE_URL}
				interactiveLayerIds={[
					regionsLayer.id,
					departementsLayer.id,
					communesLayer.id,
					communesTransparentLayer.id,
					clusterLayer.id,
					unclusteredPointLayer.id,
					unclusteredPointProtegeLayer.id,
				]}
				onClick={onClick}
				onLoad={() => {
					setIsLoaded(true);
					if (mapRef.current) {
						const isDesktop = window.innerWidth >= 768;
						const view = isDesktop ? DESKTOP_VIEW_STATE : MOBILE_VIEW_STATE;
						mapRef.current.jumpTo({
							center: [view.longitude, view.latitude],
							zoom: view.zoom,
						});
					}
				}}
				{...DEFAULT_INTERACTIVITY_CONFIG}
				{...DEFAULT_ZOOM_CONSTRAINT}
			>
				<NavigationControl position='top-left' showCompass={false} />
				{regionsGeoJSON && (
					<Source
						key={REGIONS_SOURCE_ID}
						id={REGIONS_SOURCE_ID}
						type='geojson'
						data={regionsGeoJSON}
					>
						{isNationLevel ? (
							<LayerReactMapLibre {...regionsLayer} />
						) : (
							<LayerReactMapLibre {...regionsBackgroundLayer} />
						)}
					</Source>
				)}
				{regionLabelPoints && (
					<Source
						key={REGIONS_LABELS_SOURCE_ID}
						id={REGIONS_LABELS_SOURCE_ID}
						type='geojson'
						data={regionLabelPoints}
					>
						{isNationLevel && <LayerReactMapLibre {...regionsLabelsLayer} />}
					</Source>
				)}
				{departementsGeoJSON && (
					<Source
						key={DEPARTEMENTS_SOURCE_ID}
						id={DEPARTEMENTS_SOURCE_ID}
						type='geojson'
						data={departementsGeoJSON}
					>
						{isRegionLevel && <LayerReactMapLibre {...departementsLayer} />}
						{isDepartementLevel && (
							<LayerReactMapLibre {...departementsBackgroundLayer} />
						)}
					</Source>
				)}
				{departementLabelPoints && (
					<Source
						key={DEPARTEMENTS_LABELS_SOURCE_ID}
						id={DEPARTEMENTS_LABELS_SOURCE_ID}
						type='geojson'
						data={departementLabelPoints}
					>
						{isRegionLevel && <LayerReactMapLibre {...departementsLabelsLayer} />}
					</Source>
				)}
				{communesGeoJSON && (
					<Source
						key={COMMUNES_SOURCE_ID}
						id={COMMUNES_SOURCE_ID}
						type='geojson'
						data={communesGeoJSON}
					>
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...communesTransparentLayer} />
						)}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...communesLineLayer} />
						)}
						{isDepartementLevel && <LayerReactMapLibre {...communesLayer} />}
					</Source>
				)}
				{communeLabelPoints && (
					<Source
						key={COMMUNES_LABELS_SOURCE_ID}
						id={COMMUNES_LABELS_SOURCE_ID}
						type='geojson'
						data={communeLabelPoints}
					>
						{isDepartementLevel && <LayerReactMapLibre {...communesLabelsLayer} />}
					</Source>
				)}
				{etablissementsGeoJSON && (
					<Source
						key={ETABLISSEMENTS_SOURCE_ID}
						id={ETABLISSEMENTS_SOURCE_ID}
						type='geojson'
						data={etablissementsGeoJSON}
						cluster={true}
						clusterMaxZoom={14}
						clusterRadius={50}
						clusterProperties={{
							potentiel_solaire: [
								'number',
								['get', ETABLISSEMENT_GEOJSON_KEY_POTENTIEL_SOLAIRE],
							],
						}}
					>
						{isEtablissementsLayerVisible && <LayerReactMapLibre {...clusterLayer} />}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...clusterCountLayer} />
						)}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...unclusteredPointLayer} />
						)}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...unclusteredPointProtegeLayer} />
						)}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...unclusteredPointProtegeIconLayer} />
						)}
					</Source>
				)}
				<div className='z-legend absolute inset-x-0 bottom-24 flex flex-col items-start justify-center px-4 md:flex-row md:items-center md:justify-center md:gap-4'>
					<Legend thresholds={COLOR_THRESHOLDS[level]} />
					<MenuDrom />
				</div>
			</MapFromReactMapLibre>
			{!isNationLevel && (
				<div className='absolute left-11 top-2 flex gap-1'>
					<BackButton onBack={goBackOneLevel} previousLevel={getLayerUp().level} />
					{currentLevelItem && (
						<CurrentLevel
							level={level}
							levelItem={currentLevelItem}
							openFiche={openFiche}
						/>
					)}
				</div>
			)}
			{isLoading && (
				<div className='absolute left-0 top-0 h-[100%] w-[100%] bg-slate-400 opacity-50'>
					<Loading />
				</div>
			)}
		</div>
	);
}
