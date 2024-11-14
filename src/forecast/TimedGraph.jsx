import { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';
import PropTypes from 'prop-types';

const hardcodedData = [
  { date: '2024-01-01', close: 250 },
  { date: '2024-01-02', close: 155 },
  { date: '2024-01-03', close: 160 },
  { date: '2024-01-04', close: 158 },
  { date: '2024-01-05', close: 165 },
];

const tooltipStyles = {
  ...defaultStyles,
  background: '#3b6978',
  border: '1px solid white',
  color: 'white',
};

const formatDate = timeFormat("%b %d, '%y");
const getDate = (d) => new Date(d.date);
const getStockValue = (d) => d.close;
const bisectDate = bisector((d) => new Date(d.date)).left;

export function TimedGraph({
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  tooltipData,
  tooltipLeft,
  tooltipTop,
  showTooltip,
  hideTooltip
}) {
  // Use props directly for width and height
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(hardcodedData, getDate),
      }),
    [innerWidth, margin.left]
  );

  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(hardcodedData, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight]
  );

  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(hardcodedData, x0, 1);
      const d0 = hardcodedData[index - 1];
      const d1 = hardcodedData[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockValueScale(getStockValue(d)),
      });
    },
    [showTooltip, stockValueScale, dateScale]
  );

  if (width < 10 || height < 10) return null;

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="url(#area-background-gradient)" rx={14} />
        <LinearGradient id="area-background-gradient" from="#3b6978" to="#204051" />
        <LinearGradient id="area-gradient" from="#edffea" to="#edffea" toOpacity={0.1} />
        <GridRows
          left={margin.left}
          scale={stockValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke="#edffea"
          strokeOpacity={0}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke="#edffea"
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <AreaClosed
          data={hardcodedData}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getStockValue(d)) ?? 0}
          yScale={stockValueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke="#75daad"
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="#75daad"
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${getStockValue(tooltipData)}`}
          </TooltipWithBounds>
          <Tooltip
            top={innerHeight + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
}

TimedGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  tooltipData: PropTypes.object,
  tooltipLeft: PropTypes.number,
  tooltipTop: PropTypes.number,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
};

export default withTooltip(TimedGraph);
