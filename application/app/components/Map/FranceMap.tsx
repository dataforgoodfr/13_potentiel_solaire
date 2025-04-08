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
import { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { EtablissementFeature } from '../../models/etablissements';
import BackButton from './BackButton';
import Legend from './Legend/Legend';
import { COLOR_THRESHOLDS } from './constants';
import { ClusterFeature, Layer } from './interfaces';
import {
	COMMUNES_SOURCE_ID,
	communesLayer,
	communesLineLayer,
	communesTransparentLayer,
	getCommunesLabelLayer,
} from './layers/communesLayers';
import {
	DEPARTEMENTS_SOURCE_ID,
	departementsLayer,
	getDepartementsLabelLayer,
} from './layers/departementsLayers';
import {
	ETABLISSEMENTS_SOURCE_ID,
	clusterCountLayer,
	clusterLayer,
	unclusteredPointLayer,
} from './layers/etablissementsLayers';
import { REGIONS_SOURCE_ID, getRegionsLabelLayer, regionsLayer } from './layers/regionsLayers';

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
	const [layers, setLayers] = useState<Layer[]>([{ level: 'regions', code: '' }]);
	const lastLevel = layers.slice(-1)[0];

	const { code, level } = lastLevel;

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

		const levelUp = layers.slice(-2)[0];

		if (levelUp.level === 'regions' && mapRef.current) {
			mapRef.current.easeTo({
				center: [initialViewState.longitude, initialViewState.latitude],
				zoom: initialViewState.zoom,
				duration: ANIMATION_TIME_MS,
			});
		}

		if (levelUp.level === 'departements') {
			const levelUpFeature = regionsGeoJSON?.features.find(
				(f) => f.properties.code_region === levelUp.code,
			);
			if (!levelUpFeature) {
				throw new Error('Failed to get level up region');
			}

			zoomOnFeature(levelUpFeature);
		}

		if (levelUp.level === 'communes') {
			const levelUpFeature = departementsGeoJSON?.features.find(
				(f) => f.properties.code_departement === levelUp.code,
			);
			if (!levelUpFeature) {
				throw new Error('Failed to get level up departement');
			}

			zoomOnFeature(levelUpFeature);

			toggleInteractions(false);
		}

		setLayers((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
	}

	function handleLevelChange(level: Layer) {
		setLayers((prev) => [...prev, level]);
	}

	async function handleClickOnRegion(feature: RegionFeature) {
		zoomOnFeature(feature);

		handleLevelChange({ code: feature.properties.code_region, level: 'departements' });
	}
	async function handleClickOnDepartement(feature: DepartementFeature) {
		zoomOnFeature(feature);

		handleLevelChange({ code: feature.properties.code_departement, level: 'communes' });
	}
	async function handleClickOnCommunes(feature: CommuneFeature) {
		zoomOnFeature(feature);

		handleLevelChange({ code: feature.properties.code_commune, level: 'etablissements' });

		toggleInteractions(true);
	}

	async function onClick(event: MapMouseEvent) {
		if (!mapRef.current || !event.features) return;

		const feature = event.features[0] as unknown as EventFeature;

		if (isFeatureFrom<EventRegionFeature>(feature, regionsLayer())) {
			handleClickOnRegion(feature);

			return;
		}

		if (isFeatureFrom<EventDepartementFeature>(feature, departementsLayer())) {
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
		<div>
			<MapFromReactMapLibre
				ref={mapRef}
				initialViewState={initialViewState}
				mapStyle={MAP_STYLE_URL}
				interactiveLayerIds={[
					regionsLayer().id,
					departementsLayer().id,
					communesLayer().id,
					communesTransparentLayer.id,
					clusterLayer.id,
					unclusteredPointLayer.id,
				]}
				onClick={onClick}
				onLoad={() => toggleInteractions(false)}
			>
				{regionsGeoJSON && (
					<Source
						key={REGIONS_SOURCE_ID}
						id={REGIONS_SOURCE_ID}
						type='geojson'
						data={regionsGeoJSON}
					>
						{isRegionsLayerVisible && <LayerReactMapLibre {...regionsLayer()} />}
						{isDepartementsLayerVisible && (
							<LayerReactMapLibre {...regionsLayer(false)} />
						)}
					</Source>
				)}
				{regionLabelPoints && (
					<Source id='regions-labels' type='geojson' data={regionLabelPoints}>
						<LayerReactMapLibre {...getRegionsLabelLayer(isRegionsLayerVisible)} />
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
							<LayerReactMapLibre {...departementsLayer()} />
						)}
						{isCommunesLayerVisible && (
							<LayerReactMapLibre {...departementsLayer(false)} />
						)}
					</Source>
				)}
				{departementLabelPoints && (
					<Source id='departements-labels' type='geojson' data={departementLabelPoints}>
						<LayerReactMapLibre
							{...getDepartementsLabelLayer(isDepartementsLayerVisible)}
						/>
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
					<Source id='communes-labels' type='geojson' data={communeLabelPoints}>
						<LayerReactMapLibre {...getCommunesLabelLayer(isCommunesLayerVisible)} />
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
			{lastLevel.level !== 'regions' && <BackButton onBack={goBackOneLevel} />}
			<div className='absolute bottom-2 left-2'>
				<Legend thresholds={COLOR_THRESHOLDS[lastLevel.level]} />
			</div>
		</div>
	);
}
