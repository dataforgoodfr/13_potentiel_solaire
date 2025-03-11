import * as React from 'react';

//TODO: display selected element info
function ControlPanel() {
	return (
		<div className='absolute right-0 top-0 m-6 w-72 cursor-auto bg-white p-3 text-sm leading-4 shadow-md'>
			<h3>Control Panel</h3>
			<p>Description here</p>
			<div>
				<a href='https://visgl.github.io/react-map-gl/examples/maplibre/' target='_new'>
					View Examples ↗
				</a>
			</div>
		</div>
	);
}

export default React.memo(ControlPanel);
