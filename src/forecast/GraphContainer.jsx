import { useMemo, useState, useEffect } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveBasis } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max } from '@visx/vendor/d3-array';
import './GraphContainer.css';
import { ForecastSingle } from './ForecastSingle'; // Import ForecastSingle

// Define custom tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  background: '#3b6978',
  border: '1px solid white',
  color: 'black',
};

export function GraphContainer({ graphData = [] }) {
  const [tooltip, setTooltip] = useState({ visible: false, data: null, left: 0, top: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const aspectRatio = 2;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };


  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const graphWidth = windowWidth - 40; // 80% of the window width
  const graphHeight = graphWidth / 3 + aspectRatio; 

  const margin = { top: 30, right: 0, bottom: 0, left: 0 };
  const innerWidth = graphWidth - margin.left - margin.right ;
  const innerHeight = graphHeight - margin.top - margin.bottom + 40;

  const xScale = useMemo(
    () =>
      scaleLinear({
        range: [margin.left, innerWidth + margin.left],
        domain: [0, 23],
      }),
    [innerWidth, margin.left]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [-20, (max(graphData, (d) => d.tide_height) || 0) + innerHeight / 40],
        nice: true,
      }),
    [margin.top, innerHeight, graphData]
  );

  const handleTooltip = (event) => {
    if (!Array.isArray(graphData) || graphData.length === 0) {
      setTooltip({ visible: false, data: null });
      return;
    }

    const { x } = localPoint(event) || { x: 0 };
    const x0 = Math.floor(xScale.invert(x));
    const dataPoint = graphData.find((point) => parseInt(point.graph_time.split(':')[0]) === x0);

    if (dataPoint) {
      setTooltip({
        visible: true,
        data: {
          time: dataPoint.graph_time,
          height: dataPoint.tide_height,
        },
        left: xScale(x0),
        top: yScale(dataPoint.tide_height),
      });
    } else {
      setTooltip({ visible: false, data: null });
    }
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, data: null });
  };

  if (graphWidth < 10 || graphHeight < 10) return null;

  return (
    <div className="graph-container flex flex-col items-center">
      <svg width={graphWidth} height={graphHeight}>
  {/* Existing Background and Grid */}
  <rect x={0} y={0} width={graphWidth} height={graphHeight} fill="url(#area-background-gradient)" rx={0} />
  <LinearGradient id="area-background-gradient" from="#000000" to="#134f5c" />
  <LinearGradient id="area-gradient" from="#6d8c8e" to="#5c7c80" toOpacity={0.01} />
  <GridRows left={margin.left} scale={yScale} width={innerWidth} strokeDasharray="0,1" stroke="#edffea" />
  <GridColumns
    top={margin.top}
    scale={xScale}
    height={innerHeight}
    strokeDasharray="0,1"
    stroke="#edffea"
    tickValues={[...Array(24).keys()]} 
  />
  
  {/* Time Labels */}
  {[...Array(24).keys()].map((hour) => (
    <text
      key={hour}
      x={xScale(hour)}
      y={innerHeight + margin.top + 15}
      textAnchor="middle"
      fill="#edffea"
      fontSize={10}
    >
      {String(hour).padStart(2, '0')}:00
    </text>
  ))}



  {/* Existing AreaClosed Graph */}
  <AreaClosed
    data={graphData}
    x={(d) => xScale(parseInt(d.graph_time.split(':')[0]))}
    y={(d) => yScale(d.tide_height)}
    yScale={yScale}
    strokeWidth={.5}
    stroke="url(#area-gradient)"
    fill="url(#area-gradient)"
    curve={curveBasis}
  />

  {/* Tooltip Area */}
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
    onMouseLeave={hideTooltip}
  />
  
  {/* Tooltip */}
  {tooltip.visible && (
    <g>
      <Line
        from={{ x: tooltip.left, y: margin.top }}
        to={{ x: tooltip.left, y: innerHeight + margin.top }}
        stroke="#ffffff"
        strokeWidth={1}
        strokeDasharray="1,0"
      />
      <circle cx={tooltip.left} cy={tooltip.top} r={4} fill="#536c82" stroke="white" strokeWidth={1} />
    </g>
  )}
</svg>

      {tooltip.visible && (
        <div>
          <TooltipWithBounds top={tooltip.top - 20} left={tooltip.left - 15} style={tooltipStyles}>
            <div className='text-white text-xs'>{`${tooltip.data.height} ft`}</div>
          </TooltipWithBounds>
          <Tooltip top={tooltip.top - 46} left={tooltip.left - 15} style={{ ...defaultStyles, background: 'none', color: 'white', fontSize: '12px' }}>
          {
  (() => {
    // Ensure tooltip.data.time is in the correct format (HH:MM)
    const timeString = tooltip.data.time;
    const [hours, minutes] = timeString.split(':');

    // Create a Date object, treating the time as UTC (1970-01-01)
    const time = new Date(Date.UTC(1970, 0, 1, hours, minutes));

    // Format the time in 12-hour format (AM/PM)
    let formattedHours = time.getUTCHours();
    let formattedMinutes = time.getUTCMinutes();

    // Convert to 12-hour format
    formattedHours = formattedHours % 12 || 12;  // Convert 0 hours to 12
    formattedMinutes = formattedMinutes < 10 ? `0${formattedMinutes}` : formattedMinutes;

    return `${formattedHours}:${formattedMinutes}`;
  })()
}

          </Tooltip>
        </div>
      )}
      <div>
    </div>
  </div>  
  );
}