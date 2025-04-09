import { EnergyUnit, convertKWhTo, getClosestEnergyUnit } from '@/app/utils/energy-utils';
import { ColorSpecification } from 'maplibre-gl';

import { Thresholds } from '../constants';

const SVG_CONFIG = {
	viewBoxWidth: 200,
	viewBoxheight: 40,
	width: 200,
	height: 40,
	margin: 5,
};

const BORDER_RADIUS = 8;
const OPACITY = 1;

function getLabel(unit: string) {
	return `Potentiel solaire ${unit}/an`;
}

type Legend = { thresholds: Thresholds };

export default function Legend({ thresholds }: Legend) {
	const lastThreshold = Number(Object.keys(thresholds).slice(-1)[0]);
	const lastThresholdUnit = getClosestEnergyUnit(lastThreshold);

	return (
		<div className='pointer-events-none flex flex-grow-0 flex-col items-center rounded-md bg-background p-1 text-sm text-foreground'>
			{getLabel(lastThresholdUnit)}
			<LegendColorScale thresholds={thresholds} unit={lastThresholdUnit} />
		</div>
	);
}

type LegendColorScale = {
	thresholds: Thresholds;
	unit: EnergyUnit;
};

function LegendColorScale({ thresholds, unit }: LegendColorScale) {
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
						className='fill-foreground font-normal opacity-80'
					>
						{Math.round(convertKWhTo(Number(thresholdValue), unit))}
					</text>
				))}
			</g>
		</svg>
	);
}
