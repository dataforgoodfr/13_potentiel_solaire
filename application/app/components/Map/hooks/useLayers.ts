import { useState } from 'react';

import { Layer } from '../interfaces';

/**
 * Hook that handle the layers for the map
 * @returns
 */
export default function useLayers() {
	const [layers, setLayers] = useState<Layer[]>([{ level: 'regions', code: '' }]);

	function addLayer(layer: Layer) {
		setLayers((prev) => {
			const isAlreadyLayerWithSameLevel = prev.findIndex((l) => l.level === layer.level) > -1;
			return isAlreadyLayerWithSameLevel ? [...prev.slice(0, -1), layer] : [...prev, layer];
		});
	}

	function removeLayer() {
		setLayers((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
	}

	return {
		layers,
		lastLayer: layers.slice(-1)[0],
		addLayer,
		removeLayer,
	};
}
