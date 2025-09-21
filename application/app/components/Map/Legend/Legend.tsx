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
		<div className='pointer-events-none flex flex-grow-0 flex-col items-center rounded-md bg-blue p-1 text-xs text-white md:text-sm'>
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
	const thresholdValues = Object.entries<ColorSpecification>(thresholds)
		.map(([k, v]) => [Number(k), v] as [number, ColorSpecification])
		.sort(([a], [b]) => a - b);

	const { width, height, margin, viewBoxWidth, viewBoxheight } = SVG_CONFIG;
	const slicesCount = thresholdValues.length;
	const sliceWidth = (width - 2 * margin - 2 * BORDER_RADIUS) / slicesCount;
	const sliceHeight = (height - 2 * margin) / 2;
  const LEVEL_LABELS = ['limité', 'bon', 'élevé'];

	function getAriaLabel(i: number) {
		const start = thresholdValues[i][0];
		const end = thresholdValues[i + 1]?.[0];
		const startConverted = Math.round(convertKWhTo(start, unit));
		const endConverted = end ? Math.round(convertKWhTo(end, unit)) : undefined;

		if (i === 0) return `${startConverted} à ${endConverted} ${unit}: Potentiel solaire ${LEVEL_LABELS[i]}`;
		if (end) return `${startConverted} à ${endConverted} ${unit}: Potentiel solaire ${LEVEL_LABELS[i]}`;
		return `À partir de ${startConverted} ${unit}: Potentiel solaire ${LEVEL_LABELS[i]}`;
	}

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${viewBoxWidth} ${viewBoxheight}`}
			aria-label='Légende du potentiel solaire'
		>
			<g transform={`translate(${margin}, ${margin})`}>
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={0}
					fill={thresholdValues[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
          aria-label={getAriaLabel(0)}
				/>
				{thresholdValues.map(([thresholdValue, color], i) => (
					<rect
						key={thresholdValue}
						width={sliceWidth}
						height={sliceHeight}
						x={sliceWidth * i + BORDER_RADIUS}
						fill={color}
						fillOpacity={OPACITY}
            aria-label={getAriaLabel(i)}
					/>
				))}
				<rect
					width={2 * BORDER_RADIUS}
					height={sliceHeight}
					x={width - 2 * margin - 2 * BORDER_RADIUS}
					fill={thresholdValues.slice(-1)[0][1]}
					fillOpacity={OPACITY}
					rx={BORDER_RADIUS}
          aria-label={getAriaLabel(thresholdValues.length - 1)}
				/>
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
