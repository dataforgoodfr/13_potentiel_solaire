import { Button } from '@/components/ui/button';

import { SelectDemo } from './components/SelectDemo';

export default function Home() {
	return (
		<div>
			Hello world!
			<Button variant='outline'>Clique !</Button>
			<SelectDemo />
		</div>
	);
}
