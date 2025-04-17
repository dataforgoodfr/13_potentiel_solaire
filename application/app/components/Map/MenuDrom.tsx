import { useState } from 'react';

import Image from 'next/image';

import { X } from 'lucide-react';

import useMenuDrom, { MENU_DROM_LOCATIONS } from './hooks/useMenuDrom';

export type MenuDromLocation = {
	name: string;
	codeRegion: string;
	codeDepartement: string;
	icon: string;
};

const buttonStyle =
	'flex items-center justify-center rounded-md bg-blue border border-white text-sm font-semibold shadow-md flex-shrink-0' +
	' h-[clamp(2rem,10vw,3rem)] w-[clamp(2rem,10vw,3rem)]';
const buttonActiveStyle = 'bg-slate-500';
const buttonHoverStyle = 'hover:bg-white';

function MenuDrom() {
	const { activeLocation, handleClickMetropole, handleClickDrom } = useMenuDrom();
	const [isOpen, setIsOpen] = useState(true);

	function handleTabChange(location: MenuDromLocation) {
		if (location.codeRegion === 'hexagone') {
			handleClickMetropole();

			return;
		}

		handleClickDrom(location);
	}

	if (!activeLocation) {
		return null;
	}

	return (
		<div className='mt-2 flex w-full max-w-sm flex-row justify-start gap-2 bg-transparent md:justify-center'>
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
					{MENU_DROM_LOCATIONS.map((location) => (
						<button
							key={location.codeRegion}
							onClick={() => handleTabChange(location)}
							className={`${buttonStyle} ${activeLocation.codeRegion === location.codeRegion ? buttonActiveStyle : buttonHoverStyle}`}
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
