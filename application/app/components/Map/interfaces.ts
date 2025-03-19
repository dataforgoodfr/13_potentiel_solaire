import { Geometry } from 'geojson';

export type ClusterFeature<TGeometry extends Geometry> = {
	properties: {
		cluster: true;
		cluster_id: number;
		point_count: number;
		point_count_abbreviated: number;
	};
	geometry: TGeometry;
};
