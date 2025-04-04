import { useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

import Image from 'next/image';

import { X } from 'lucide-react';

interface MenuDromProps {
	mapRef: React.RefObject<MapRef | null>;
}

const locations: Record<string, { coords: [number, number, number]; icon: string }> = {
	guadeloupe: { coords: [-61.5833, 16.25, 8], icon: './DROMs/guadeloupe.svg' },
	martinique: { coords: [-61.0167, 14.6415, 8], icon: './DROMs/martinique.svg' },
	guyane: { coords: [-53.0333, 4.0, 6], icon: './DROMs/guyane.svg' },
	mayotte: { coords: [45.1662, -12.8275, 9], icon: './DROMs/mayotte.svg' },
	reunion: { coords: [55.5364, -21.1151, 8], icon: './DROMs/reunion.svg' },
	hexagone: { coords: [1.8883, 45.6033, 4.5], icon: './DROMs/hexagone.svg' },
};

const buttonStyle =
	'flex h-12 w-12 items-center justify-center rounded-md bg-blue border border-white text-sm font-semibold shadow-md';
const buttonActiveStyle = 'bg-gray-400';
const buttonHoverStyle = 'hover:bg-white';

const MenuDrom: React.FC<MenuDromProps> = ({ mapRef }) => {
	const [activeTab, setActiveTab] = useState('hexagone');
	const [isOpen, setIsOpen] = useState(true);

	if (!mapRef.current) return null;

	const flyToLocation = (locationKey: string) => {
		const { coords } = locations[locationKey];
		const [lng, lat, zoom] = coords;
		mapRef.current?.flyTo({ center: [lng, lat], zoom, essential: true });
		setActiveTab(locationKey);
	};

	return (
		<div className='absolute bottom-4 left-0 flex flex-col items-start px-4 md:left-3 md:px-0'>
			<div className='mt-2 flex w-full max-w-sm flex-row justify-center gap-2 bg-transparent'>
				<button onClick={() => setIsOpen(!isOpen)} className={buttonStyle}>
					{isOpen ? (
						<X color='white' />
					) : (
						<Image
							src={locations[activeTab].icon}
							alt={activeTab}
							width={24}
							height={24}
						/>
					)}
				</button>

				{isOpen && (
					<div className='flex gap-2'>
						{Object.entries(locations).map(([key, { icon }]) => (
							<button
								key={key}
								onClick={() => flyToLocation(key)}
								className={`${buttonStyle} ${activeTab === key ? buttonActiveStyle : buttonHoverStyle}`}
								aria-label={`Go to ${key}`}
							>
								<Image src={icon} alt={key} width={24} height={24} />
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MenuDrom;
