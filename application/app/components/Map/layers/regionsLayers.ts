import { LayerProps } from 'react-map-gl/maplibre';

import { TypeEtablissement } from '@/app/models/etablissements';
import { POTENTIEL_KEY_BY_LEVEL_MAPPING, RegionFeaturePropertiesKeys } from '@/app/models/regions';
import { FilterState } from '@/app/utils/providers/mapFilterProvider';
import { ExpressionSpecification } from 'maplibre-gl';

import { COLOR_THRESHOLDS } from '../constants';
import { zonesLayerPaint } from './zonesLayersPaint';

export const REGIONS_SOURCE_ID = 'regions';
export const REGIONS_LABELS_SOURCE_ID = 'regions-labels';

function getRegionsLayer(filterState: FilterState, isBackground = false) {
	return {
		id: 'regions',
		type: 'fill',
		source: REGIONS_SOURCE_ID,
		paint: zonesLayerPaint(
			COLOR_THRESHOLDS.nation,
			isBackground,
			fillColorFromFilters(filterState) as ExpressionSpecification,
		),
		maxzoom: 10,
	} satisfies LayerProps;
}

export const regionsLayer = (filterState: FilterState) => getRegionsLayer(filterState);
export const regionsBackgroundLayer = (filterState: FilterState) =>
	getRegionsLayer(filterState, true);

export const regionsLabelsLayer = {
	id: 'regions-labels',
	type: 'symbol',
	source: REGIONS_LABELS_SOURCE_ID,
	layout: {
		'text-field': ['get', RegionFeaturePropertiesKeys.Nom],
		'text-size': 14,
		'text-anchor': 'center',
	},
	paint: {
		'text-color': '#000000',
		'text-halo-color': '#ffffff',
		'text-halo-width': 2,
	},
} satisfies LayerProps;

export function fillColorFromFilters(filters: FilterState) {
	const potentielKeys = Object.entries(filters)
		.filter(([key, value]) => key !== 'All' && value === true)
		.map(([key]) => ['get', POTENTIEL_KEY_BY_LEVEL_MAPPING[key as TypeEtablissement]]);
	return ['+', ...potentielKeys];
}
