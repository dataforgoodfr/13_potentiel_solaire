import { LocateFixed } from 'lucide-react';

type GeolocButtonProps = {
	handleClick: () => void;
};

const GeolocButton: React.FC<GeolocButtonProps> = ({ handleClick }) => {
	return (
		<button
			className='absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600'
			onClick={handleClick}
		>
			<LocateFixed />
		</button>
	);
};

export default GeolocButton;
