import { Color, Thresholds } from '../constants';

const SVG_CONFIG = {
	viewBoxWidth: 200,
	viewBoxheight: 50,
	width: 200,
	height: 50,
	margin: 5,
};

const OPACITY = 1;

function getLabel(unit: string) {
	return `Potentiel solaire ${unit}/an`;
}

type Legend = { thresholds: Thresholds };

export default function Legend({ thresholds }: Legend) {
	return (
		<div className='flex flex-col items-center'>
			{getLabel('TODO')}
			<LegendColorScale thresholds={thresholds} />
		</div>
	);
}

type LegendColorScale = {
	thresholds: Thresholds;
};

function LegendColorScale({ thresholds }: LegendColorScale) {
	const thresholdValues = Object.entries<Color>(thresholds);

	const { width, height, margin, viewBoxWidth, viewBoxheight } = SVG_CONFIG;
	const slicesCount = thresholdValues.length;
	const sliceWidth = (width - 2 * margin) / slicesCount;
	const sliceHeight = (height - 2 * margin) / 2;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} ${viewBoxheight}`}>
			<g
				transform={`translate(${margin}, ${margin})`}
				style={{ borderRadius: 5, backgroundColor: 'red' }}
			>
				{thresholdValues.map(([thresholdValue, color], i) => (
					<rect
						key={thresholdValue}
						width={sliceWidth}
						height={sliceHeight}
						x={sliceWidth * i}
						fill={color}
						fillOpacity={OPACITY}
					/>
				))}
				{thresholdValues.slice(1).map(([thresholdValue], i) => (
					<text
						key={thresholdValue}
						x={sliceWidth * (i + 1)}
						y={sliceHeight + 15}
						textAnchor='middle'
					>
						{thresholdValue}
					</text>
				))}
			</g>
		</svg>
	);
}
