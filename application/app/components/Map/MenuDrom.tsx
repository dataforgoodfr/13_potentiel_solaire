import { useState } from 'react';

import Image from 'next/image';

import { X } from 'lucide-react';

type Tab = (typeof LOCATIONS)[number]['codeRegion'];

export type MenuDromLocation = {
	name: string;
	codeRegion: string;
	codeDepartement: string;
	icon: string;
};

const LOCATIONS: MenuDromLocation[] = [
	{
		name: 'guadeloupe',
		codeRegion: '01',
		codeDepartement: '971',
		icon: './DROMs/guadeloupe.svg',
	},
	{
		name: 'martinique',
		codeRegion: '02',
		codeDepartement: '972',
		icon: './DROMs/martinique.svg',
	},
	{
		name: 'guyane',
		codeRegion: '03',
		codeDepartement: '973',
		icon: './DROMs/guyane.svg',
	},
	{
		name: 'reunion',
		codeRegion: '04',
		codeDepartement: '974',
		icon: './DROMs/reunion.svg',
	},
	{
		name: 'mayotte',
		codeRegion: '06',
		codeDepartement: '976',
		icon: './DROMs/mayotte.svg',
	},
	{
		name: 'hexagone',
		codeRegion: 'hexagone',
		codeDepartement: 'hexagone',
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
	const [activeTab, setActiveTab] = useState<Tab>('hexagone');
	const [isOpen, setIsOpen] = useState(true);

	function handleTabChange(location: MenuDromLocation) {
		setActiveTab(location.codeRegion);

		if (location.codeRegion === 'hexagone') {
			onClickMetropole();

			return;
		}

		onClickDrom(location);
	}

	const activeLocation = LOCATIONS.find((location) => location.codeRegion === activeTab);

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
							key={location.codeRegion}
							onClick={() => handleTabChange(location)}
							className={`${buttonStyle} ${activeTab === location.codeRegion ? buttonActiveStyle : buttonHoverStyle}`}
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
