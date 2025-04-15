'use client';

import { useRef, useState } from 'react';
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
import { EaseToOptions, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { EtablissementFeature } from '../../models/etablissements';
import BackButton from './BackButton';
import Legend from './Legend/Legend';
import MenuDrom, { MenuDromLocation } from './MenuDrom';
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
	departementsBackgroundLayer,
	departementsLabelsLayer,
	departementsLayer,
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
	regionsBackgroundLayer,
	regionsLabelsLayer,
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

function interact(enabled: boolean) {
	return {
		scrollZoom: enabled,
		boxZoom: enabled,
		dragRotate: enabled,
		dragPan: enabled,
		keyboard: enabled,
		doubleClickZoom: enabled,
		touchZoomRotate: enabled,
	};
}

export default function FranceMap({ onSelect }: FranceMapProps) {
	const mapRef = useRef<MapRef>(null);
	const {
		layers,
		lastLayer: { code, level },
		addLayer,
		removeLayer,
		resetLayer,
	} = useLayers();
	const [isInteractive, setIsInteractive] = useState(false);

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

	function easeTo(options: EaseToOptions) {
		if (!mapRef.current) return;

		mapRef.current.easeTo({
			...options,
			duration: ANIMATION_TIME_MS,
		});
	}

	function easeToInitialView() {
		easeTo({
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
		});
	}

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
		setIsInteractive(enabled);
	}

	function goBackOneLevel() {
		if (layers.length < 2) return;

		const layerUp = layers.slice(-2)[0];

		if (layerUp.level === 'regions' && mapRef.current) {
			easeToInitialView();
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

	async function handleResetMap() {
		easeToInitialView();
		resetLayer();
	}
	async function handleClickOnDroms(location: MenuDromLocation) {
		easeTo(location.coordinates);

		addLayer({ code: location.code, level: 'departements' });
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function handleOnLocate(feature: CommuneFeature) {
		if (!mapRef.current) return;

		handleClickOnCommunes(feature);
		//TODO: load higher levels (departement, region)
	}

	return (
		<div className='relative h-[80vh] w-full sm:h-[600px] md:h-[800px] lg:h-[1000px]'>
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
				onLoad={() => toggleInteractions(false)}
				{...interact(isInteractive)}
			>
				{regionsGeoJSON && (
					<Source
						key={REGIONS_SOURCE_ID}
						id={REGIONS_SOURCE_ID}
						type='geojson'
						data={regionsGeoJSON}
					>
						{isRegionsLayerVisible ? (
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
							<LayerReactMapLibre {...departementsLayer} />
						)}
						{isCommunesLayerVisible && (
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
						{isCommunesLayerVisible && <LayerReactMapLibre {...communesLayer} />}
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
			<div className='absolute bottom-2 left-2 flex flex-col items-start md:flex-row md:gap-4'>
				<Legend thresholds={COLOR_THRESHOLDS[level]} />
				{isRegionsLayerVisible && (
					<MenuDrom onClickDrom={handleClickOnDroms} onClickMetropole={handleResetMap} />
				)}
			</div>
		</div>
	);
}
