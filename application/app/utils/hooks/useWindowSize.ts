import { useEffect, useState } from 'react';

export default function useWindowSize() {
	const [windowSize, setWindowSize] = useState(0);

	useEffect(() => {
		// Fonction de mise à jour de la taille de l'écran
		const handleResize = () => {
			setWindowSize(window.innerWidth);
		};

		// Ajout du listener
		window.addEventListener('resize', handleResize);

		// Appel initial
		handleResize();

		// Nettoyage du listener
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
}
