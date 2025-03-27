import { Button } from '@/components/ui/button';

import MapWithLoader from './components/Map/MapWithLoader';
import { SelectDemo } from './components/SelectDemo';

export default function Home() {
	return (
		<div className='mx-auto flex max-w-screen-xl items-center justify-around'>
			<MapWithLoader />
			<Button variant='outline'>Clique !</Button>
			<SelectDemo />
		</div>
	);
}
