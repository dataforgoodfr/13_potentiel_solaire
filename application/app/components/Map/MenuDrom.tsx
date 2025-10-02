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
	' h-[clamp(2rem,10vw,3rem)] w-[clamp(2rem,10vw,3rem)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue';
const buttonActiveStyle = 'bg-slate-500';
const otherButtonStyle = 'hover:bg-white focus:bg-white';

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
		<div className='mt-2 flex w-full max-w-sm flex-row justify-start gap-2 bg-transparent'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={buttonStyle}
				aria-expanded={isOpen}
				aria-label={isOpen ? 'Fermer le menu DROM' : 'Ouvrir le menu DROM'}
			>
				{isOpen ? (
					<X color='white' aria-hidden='true' />
				) : (
					<Image src={activeLocation.icon} alt='' width={24} height={24} />
				)}
			</button>
			{isOpen && (
				<div className='flex gap-2'>
					{MENU_DROM_LOCATIONS.map((location) => (
						<button
							key={location.codeRegion}
							onClick={() => handleTabChange(location)}
							className={`${buttonStyle} ${activeLocation.codeRegion === location.codeRegion ? buttonActiveStyle : otherButtonStyle}`}
							aria-label={`Naviguer vers ${location.name}`}
							aria-current={
								activeLocation.codeRegion === location.codeRegion
									? 'location'
									: undefined
							}
						>
							<Image src={location.icon} alt='' width={24} height={24} />
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default MenuDrom;
