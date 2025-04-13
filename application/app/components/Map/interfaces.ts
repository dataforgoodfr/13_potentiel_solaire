import { Geometry } from 'geojson';
import { GeoJSONFeature } from 'maplibre-gl';

export type ClusterFeature<TGeometry extends Geometry> = {
	type: GeoJSONFeature['type'];
	properties: {
		cluster: true;
		cluster_id: number;
		point_count: number;
		point_count_abbreviated: number;
	};
	geometry: TGeometry;
};

export type Level = 'etablissement' | 'commune' | 'departement' | 'region' | 'nation';

export type Layer = {
	code: string;
	level: Level;
};
