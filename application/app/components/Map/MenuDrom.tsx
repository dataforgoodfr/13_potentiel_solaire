import { useState } from 'react';

import Image from 'next/image';

import { X } from 'lucide-react';
import { CenterZoomBearing } from 'maplibre-gl';

type Coordinates = Required<Pick<CenterZoomBearing, 'center' | 'zoom'>>;

export type MenuDromLocation = {
	name: string;
	code: string;
	coordinates: Coordinates;
	icon: string;
};

const LOCATIONS: MenuDromLocation[] = [
	{
		name: 'guadeloupe',
		code: '01',
		coordinates: { center: [-61.5833, 16.25], zoom: 8 },
		icon: './DROMs/guadeloupe.svg',
	},
	{
		name: 'martinique',
		code: '02',
		coordinates: { center: [-61.0167, 14.6415], zoom: 8 },
		icon: './DROMs/martinique.svg',
	},
	{
		name: 'guyane',
		code: '03',
		coordinates: { center: [-53.0333, 4.0], zoom: 6 },
		icon: './DROMs/guyane.svg',
	},
	{
		name: 'reunion',
		code: '04',
		coordinates: { center: [45.1662, -12.8275], zoom: 9 },
		icon: './DROMs/reunion.svg',
	},
	{
		name: 'mayotte',
		code: '06',
		coordinates: { center: [55.5364, -21.1151], zoom: 8 },
		icon: './DROMs/mayotte.svg',
	},
	{
		name: 'hexagone',
		code: 'hexagone',
		coordinates: { center: [1.8883, 45.6033], zoom: 4.5 },
		icon: './DROMs/hexagone.svg',
	},
];

const buttonStyle =
	'flex h-12 w-12 items-center justify-center rounded-md bg-blue border border-white text-sm font-semibold shadow-md';
const buttonActiveStyle = 'bg-gray-400';
const buttonHoverStyle = 'hover:bg-white';

interface MenuDromProps {
	onClickDrom: (location: MenuDromLocation) => void;
	onClickMetropole: () => void;
}

function MenuDrom({ onClickDrom, onClickMetropole }: MenuDromProps) {
	const [activeTab, setActiveTab] = useState('hexagone');
	const [isOpen, setIsOpen] = useState(true);

	function handleTabChange(location: MenuDromLocation) {
		setActiveTab(location.code);

		if (location.code === 'hexagone') {
			onClickMetropole();

			return;
		}

		onClickDrom(location);
	}

	const activeLocation = LOCATIONS.find((location) => location.code === activeTab);

	if (!activeLocation) {
		return null;
	}

	return (
		<div className='mt-2 flex w-full max-w-sm flex-row justify-center gap-2 bg-transparent'>
			<button onClick={() => setIsOpen(!isOpen)} className={buttonStyle}>
				{isOpen ? (
					<X color='white' />
				) : (
					<Image
						src={activeLocation.icon}
						alt={activeLocation.name}
						width={24}
						height={24}
					/>
				)}
			</button>
			{isOpen && (
				<div className='flex gap-2'>
					{LOCATIONS.map((location) => (
						<button
							key={location.code}
							onClick={() => handleTabChange(location)}
							className={`${buttonStyle} ${activeTab === location.code ? buttonActiveStyle : buttonHoverStyle}`}
							aria-label={`Go to ${location.name}`}
						>
							<Image src={location.icon} alt={location.name} width={24} height={24} />
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default MenuDrom;
