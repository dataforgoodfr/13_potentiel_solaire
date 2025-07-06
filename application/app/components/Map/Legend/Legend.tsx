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

type LegendProps = { thresholds: Thresholds };

export default function Legend({ thresholds }: LegendProps) {
	const lastThreshold = Number(Object.keys(thresholds).slice(-1)[0]);
	const lastThresholdUnit = getClosestEnergyUnit(lastThreshold);

	return (
		<div
			className='pointer-events-none flex flex-grow-0 flex-col items-center rounded-md bg-blue p-2 text-sm text-white'
			role='img'
			aria-label={`Légende du potentiel solaire en ${lastThresholdUnit}/an`}
		>
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

	const labels = ['Limité', 'Bon', 'Élevé'];

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${viewBoxWidth} ${viewBoxheight}`}
			role='img'
			aria-label='Échelle des niveaux de potentiel solaire'
		>
			<g transform={`translate(${margin}, ${margin})`}>
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={0}
					fill={thresholdValues[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
				>
					<title>{labels[0]}</title>
				</rect>
				{thresholdValues.map(([thresholdValue, color], i) => (
					<rect
						key={thresholdValue}
						width={sliceWidth}
						height={sliceHeight}
						x={sliceWidth * i + BORDER_RADIUS}
						fill={color}
						fillOpacity={OPACITY}
					>
						<title>{labels[i]}</title>
					</rect>
				))}
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={width - 2 * margin - 2 * BORDER_RADIUS}
					fill={thresholdValues.slice(-1)[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
				>
					<title>{labels[labels.length - 1]}</title>
				</rect>
				{thresholdValues.map(([thresholdValue], i) => (
					<text
						key={thresholdValue}
						x={sliceWidth * i + BORDER_RADIUS}
						y={sliceHeight + 15}
						textAnchor='middle'
						className='fill-white font-normal opacity-80'
					>
						{Math.round(convertKWhTo(Number(thresholdValue), unit))}
					</text>
				))}
			</g>
		</svg>
	);
}
