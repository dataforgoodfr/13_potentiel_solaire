import { useState } from 'react';

import { Layer } from '../interfaces';

const initialState: Layer[] = [{ level: 'regions', code: '' }];

/**
 * Hook that handle the layers for the map
 * @returns
 */
export default function useLayers() {
	const [layers, setLayers] = useState<Layer[]>(initialState);

	function addLayer(layer: Layer) {
		setLayers((prev) => {
			// Add layer if a layer with the same level doesnt exist, otherwise it replaces it
			const isAlreadyLayerWithSameLevel = prev.findIndex((l) => l.level === layer.level) > -1;
			return isAlreadyLayerWithSameLevel ? [...prev.slice(0, -1), layer] : [...prev, layer];
		});
	}

	function removeLayer() {
		setLayers((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
	}

	function resetLayer() {
		setLayers(initialState);
	}

	return {
		layers,
		lastLayer: layers.slice(-1)[0],
		addLayer,
		removeLayer,
		resetLayer,
	};
}
