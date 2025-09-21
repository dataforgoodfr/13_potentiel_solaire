import { CommuneFeatureProperties } from '@/app/models/communes';
import { DepartementFeatureProperties } from '@/app/models/departements';
import { RegionFeatureProperties } from '@/app/models/regions';
import { FillLayerSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';
import thresholdsToStepColorsParams from './thresholdsToColorsParams';

const ZONE_GEOJSON_KEY_POTENTIEL_SOLAIRE_TOTAL =
	'potentiel_solaire_total' satisfies keyof DepartementFeatureProperties &
		keyof CommuneFeatureProperties &
		keyof RegionFeatureProperties;

/**
 * Get the fill paint color properties for a zone layer.
 * We map the color based on level thresholds.
 * @param thresholds
 * @returns
 */
export function zonesLayerPaint(thresholds: Thresholds) {
	const fillColors = thresholdsToStepColorsParams(thresholds);

	return {
		'fill-color': ['step', ['get', ZONE_GEOJSON_KEY_POTENTIEL_SOLAIRE_TOTAL], ...fillColors],
		'fill-outline-color': 'black',
	} satisfies FillLayerSpecification['paint'];
}

/**
 * Get the fill paint opacity for a zone layer.
 * @param key the geojson property key to use for matching
 * @param value the value of the geojson property key to match
 * @param isLastLevel if true, the map is at the last level (etablissements)
 * @param isBackground if true, the zone is in the background
 * @returns
 */
export function zonesLayerFillOpacity(
	key: string,
	value: string | null,
	isLastLevel: boolean,
	isBackground: boolean,
) {
	/**
	 * If the zone has been selected but is the last level (etablissements) we want to hide it.
	 * In that case, in order to properly see the streets at etablissements level, we must hide every zone to have no fill from highest to lowest levels.
	 * selectedZoneOpacity: the zone has been selected and is part of a previous level
	 * notSelectedZoneOpacity: the zone is the currently displayed level and is the next level available for selection
	 * isBackground = true means that the zone is adjacent to the selected zone stack and is not focused
	 */
	const selectedZoneOpacity = isLastLevel ? 0 : 0.5;
	const notSelectedZoneOpacity = isBackground ? 0.5 : 1;
	return {
		'fill-opacity': [
			'match',
			['get', key],
			value ?? '',
			selectedZoneOpacity,
			notSelectedZoneOpacity,
		],
	} satisfies FillLayerSpecification['paint'];
}
