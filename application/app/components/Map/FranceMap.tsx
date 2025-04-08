'use client';

import { useRef } from 'react';
import {
	LayerProps,
	Layer as LayerReactMapLibre,
	LngLatLike,
	Map as MapFromReactMapLibre,
	MapMouseEvent,
	MapProps as MapPropsReactMapLibre,
	MapRef,
	Source,
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
import GeolocButton from '../GeolocButton';
import BackButton from './BackButton';
import Legend from './Legend/Legend';
import { COLOR_THRESHOLDS } from './constants';
import useLayers from './hooks/useLayers';
import { ClusterFeature } from './interfaces';
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
	departementsLabelsLayer,
	getDepartementsLayer,
} from './layers/departementsLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	unclusteredPointLayer,
} from './layers/etablissementsLayers';
import {
	REGIONS_LABELS_SOURCE_ID,
	REGIONS_SOURCE_ID,
	getRegionsLayer,
	regionsLabelsLayer,
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

const style: React.CSSProperties = {
	width: 1200,
	height: 800,
};

const ANIMATION_TIME_MS = 800;
const INTERACTIONS = [
	'scrollZoom',
	'boxZoom',
	'dragRotate',
	'dragPan',
	'keyboard',
	'doubleClickZoom',
	'touchZoomRotate',
] as const;

type EventFeature<Feature extends GeoJSON.Feature = GeoJSON.Feature> = Feature & {
	layer: LayerProps;
	source: string;
};

type EventRegionFeature = EventFeature<RegionFeature>;
type EventDepartementFeature = EventFeature<DepartementFeature>;
type EventCommuneFeature = EventFeature<CommuneFeature>;
type EventEtablissementFeature = EventFeature<EtablissementFeature>;
type ClusterEtablissementFeature = EventFeature<ClusterFeature<EtablissementFeature['geometry']>>;

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
	const {
		layers,
		lastLayer: { code, level },
		addLayer,
		removeLayer,
	} = useLayers();

	const isRegionsLayerVisible = level === 'regions';
	const isDepartementsLayerVisible = level === 'departements';
	const isCommunesLayerVisible = level === 'communes';
	const isEtablissementsLayerVisible = level === 'etablissements';

	const { regionsGeoJSON, regionLabelPoints } = useRegionsGeoJSON();
	const { departementsGeoJSON, departementLabelPoints } = useDepartementsGeoJSON(
		code ?? null,
		isDepartementsLayerVisible,
	);
	const { communesGeoJSON, communeLabelPoints } = useCommunesGeoJSON(
		code ?? null,
		isCommunesLayerVisible,
	);
	const { etablissementsGeoJSON } = useEtablissementsGeoJSON(
		code ?? null,
		isEtablissementsLayerVisible,
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

	function toggleInteractions(enabled: boolean) {
		// TODO - find a way to toggle interactions
		// This doesnt work
		INTERACTIONS.forEach((interaction) => {
			if (!mapRef.current) return;
			if (enabled) {
				//mapRef.current[interaction].enable();
			} else {
				//mapRef.current[interaction].disable();
			}
		});
	}

	function goBackOneLevel() {
		if (layers.length < 2) return;

		const layerUp = layers.slice(-2)[0];

		if (layerUp.level === 'regions' && mapRef.current) {
			mapRef.current.easeTo({
				center: [initialViewState.longitude, initialViewState.latitude],
				zoom: initialViewState.zoom,
				duration: ANIMATION_TIME_MS,
			});
		}

		if (layerUp.level === 'departements') {
			const layerUpFeature = regionsGeoJSON?.features.find(
				(f) => f.properties.code_region === layerUp.code,
			);
			if (!layerUpFeature) {
				throw new Error('Failed to get level up region');
			}

			zoomOnFeature(layerUpFeature);
		}

		if (layerUp.level === 'communes') {
			const layerUpFeature = departementsGeoJSON?.features.find(
				(f) => f.properties.code_departement === layerUp.code,
			);
			if (!layerUpFeature) {
				throw new Error('Failed to get level up departement');
			}

			zoomOnFeature(layerUpFeature);

			toggleInteractions(false);
		}

		removeLayer();
	}

	async function handleClickOnRegion(feature: RegionFeature) {
		zoomOnFeature(feature);

		addLayer({ code: feature.properties.code_region, level: 'departements' });
	}
	async function handleClickOnDepartement(feature: DepartementFeature) {
		zoomOnFeature(feature);

		addLayer({ code: feature.properties.code_departement, level: 'communes' });
	}
	async function handleClickOnCommunes(feature: CommuneFeature) {
		zoomOnFeature(feature);

		addLayer({ code: feature.properties.code_commune, level: 'etablissements' });

		toggleInteractions(true);
	}

	async function onClick(event: MapMouseEvent) {
		if (!mapRef.current || !event.features) return;

		const feature = event.features[0] as unknown as EventFeature;

		if (isFeatureFrom<EventRegionFeature>(feature, getRegionsLayer())) {
			handleClickOnRegion(feature);

			return;
		}

		if (isFeatureFrom<EventDepartementFeature>(feature, getDepartementsLayer())) {
			handleClickOnDepartement(feature);

			return;
		}

		if (
			isFeatureFrom<EventCommuneFeature>(feature, communesLayer()) ||
			isFeatureFrom<EventCommuneFeature>(feature, communesTransparentLayer)
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

	function handleOnLocate(feature: CommuneFeature) {
		if (!mapRef.current) return;

		handleClickOnCommunes(feature);
		//TODO: load higher levels (departement, region)
	}

	return (
		<div className='relative'>
			<MapFromReactMapLibre
				ref={mapRef}
				initialViewState={initialViewState}
				mapStyle={MAP_STYLE_URL}
				interactiveLayerIds={[
					getRegionsLayer().id,
					getDepartementsLayer().id,
					communesLayer().id,
					communesTransparentLayer.id,
					clusterLayer.id,
					unclusteredPointLayer.id,
				]}
				style={style}
				onClick={onClick}
				onLoad={() => toggleInteractions(false)}
			>
				<GeolocButton onLocate={handleOnLocate} />
				{regionsGeoJSON && (
					<Source
						key={REGIONS_SOURCE_ID}
						id={REGIONS_SOURCE_ID}
						type='geojson'
						data={regionsGeoJSON}
					>
						{isRegionsLayerVisible && <LayerReactMapLibre {...getRegionsLayer()} />}
						{isDepartementsLayerVisible && (
							<LayerReactMapLibre {...getRegionsLayer(false)} />
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
						{isRegionsLayerVisible && <LayerReactMapLibre {...regionsLabelsLayer} />}
					</Source>
				)}
				{departementsGeoJSON && (
					<Source
						key={DEPARTEMENTS_SOURCE_ID}
						id={DEPARTEMENTS_SOURCE_ID}
						type='geojson'
						data={departementsGeoJSON}
					>
						{isDepartementsLayerVisible && (
							<LayerReactMapLibre {...getDepartementsLayer()} />
						)}
						{isCommunesLayerVisible && (
							<LayerReactMapLibre {...getDepartementsLayer(false)} />
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
						{isDepartementsLayerVisible && (
							<LayerReactMapLibre {...departementsLabelsLayer} />
						)}
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
						{isCommunesLayerVisible && <LayerReactMapLibre {...communesLayer()} />}
					</Source>
				)}
				{communeLabelPoints && (
					<Source
						key={COMMUNES_LABELS_SOURCE_ID}
						id={COMMUNES_LABELS_SOURCE_ID}
						type='geojson'
						data={communeLabelPoints}
					>
						{isCommunesLayerVisible && <LayerReactMapLibre {...communesLabelsLayer} />}
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
							potentiel_solaire: ['number', ['get', 'potentiel_solaire']],
						}}
					>
						{isEtablissementsLayerVisible && <LayerReactMapLibre {...clusterLayer} />}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...clusterCountLayer} />
						)}
						{isEtablissementsLayerVisible && (
							<LayerReactMapLibre {...unclusteredPointLayer} />
						)}
					</Source>
				)}
			</MapFromReactMapLibre>
			{level !== 'regions' && <BackButton onBack={goBackOneLevel} />}
			<div className='absolute bottom-2 left-2'>
				<Legend thresholds={COLOR_THRESHOLDS[level]} />
			</div>
		</div>
	);
}
