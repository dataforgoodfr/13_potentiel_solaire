import { ColorSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';

const SVG_CONFIG = {
	viewBoxWidth: 200,
	viewBoxheight: 50,
	width: 200,
	height: 50,
	margin: 5,
};

const BORDER_RADIUS = 10;
const OPACITY = 1;

function getLabel(unit: string) {
	return `Potentiel solaire ${unit}/an`;
}

type Legend = { thresholds: Thresholds };

export default function Legend({ thresholds }: Legend) {
	return (
		<div className='flex flex-col items-center rounded-md bg-primary text-sm text-primary-foreground'>
			{getLabel('TODO')}
			<LegendColorScale thresholds={thresholds} />
		</div>
	);
}

type LegendColorScale = {
	thresholds: Thresholds;
};

function LegendColorScale({ thresholds }: LegendColorScale) {
	const thresholdValues = Object.entries<ColorSpecification>(thresholds);

	const { width, height, margin, viewBoxWidth, viewBoxheight } = SVG_CONFIG;
	const slicesCount = thresholdValues.length;
	const sliceWidth = (width - 2 * margin - 2 * BORDER_RADIUS) / slicesCount;
	const sliceHeight = (height - 2 * margin) / 2;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} ${viewBoxheight}`}>
			<g transform={`translate(${margin}, ${margin})`}>
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={0}
					fill={thresholdValues[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
				/>
				{thresholdValues.map(([thresholdValue, color], i) => (
					<rect
						key={thresholdValue}
						width={sliceWidth}
						height={sliceHeight}
						x={sliceWidth * i + BORDER_RADIUS}
						fill={color}
						fillOpacity={OPACITY}
					/>
				))}
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={width - 2 * margin - 2 * BORDER_RADIUS}
					fill={thresholdValues.slice(-1)[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
				/>
				{thresholdValues.slice(1).map(([thresholdValue], i) => (
					<text
						key={thresholdValue}
						x={sliceWidth * (i + 1) + BORDER_RADIUS}
						y={sliceHeight + 15}
						textAnchor='middle'
						className='fill-primary-foreground'
					>
						{thresholdValue}
					</text>
				))}
			</g>
		</svg>
	);
}
