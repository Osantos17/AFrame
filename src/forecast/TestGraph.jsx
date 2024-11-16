import { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max } from '@visx/vendor/d3-array';
import { curveCatmullRom, curveBasis } from '@visx/curve';
import { debounce } from 'lodash';



const tooltipStyles = {
  ...defaultStyles,
  background: '#3b6978',
  border: '1px solid white',
  color: 'white',
};

export function TestGraph({
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  tooltipData,
  tooltipLeft,
  tooltipTop,
  showTooltip,
  hideTooltip
}) {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const debouncedFetchData = debounce(async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/graph-points/1');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        const filteredData = filterMidnightData(data);
        setGraphData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 300); // Debounce delay in milliseconds (adjust as needed)
  
    debouncedFetchData();
  
    // Cleanup debounce on component unmount
    return () => debouncedFetchData.cancel();
  }, []);

  function filterMidnightData(data) {
    let startTime = null;
    let endTime = null;
    return data.filter((point, index) => {
      const [hour, minute] = point.graph_time.split(':').map(Number);
      const isMidnight = hour === 0 && minute === 0;
      const isNoon = hour === 23 && minute === 0;
      const isExactHour = minute === 0; // Only include times where the minute is exactly 00
  
      // Set the startTime when the first 00:00 is found
      if (isMidnight && startTime === null) {
        startTime = index;
      }
  
      // Set the endTime when the first 23:00 is found after startTime
      if (isNoon && startTime !== null && endTime === null) {
        endTime = index;
      }
  
      // Filter data between the first 00:00 and 23:00, and ensure only full hours (minute === 0)
      return startTime !== null && (endTime === null ? index >= startTime : index <= endTime) && isExactHour;
    }).map((point) => ({
      graph_time: point.graph_time, // Keep the graph_time
      tide_height: point.tide_height, // Keep tide height for graph
    }));
  }

  // Scales for x-axis (hour) and y-axis (height)
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = useMemo(() => scaleLinear({
    range: [margin.left, innerWidth + margin.left],
    domain: [0, 23], // 24 hours, from 00:00 to 23:00
  }), [innerWidth, margin.left]);

  const yScale = useMemo(() => scaleLinear({
    range: [innerHeight + margin.top, margin.top],
    domain: [-10, (max(graphData, (d) => d.tide_height) || 0) + innerHeight / 100],
    nice: true,
  }), [margin.top, innerHeight, graphData]);
  

  // Tooltip handler
  const handleTooltip = useCallback((event) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = Math.round(xScale.invert(x)); // Get the index based on the x-coordinate
    const d = graphData[x0]; // Fetch the corresponding data point
    if (d) {
      showTooltip({
        tooltipData: {
          time: d.graph_time,  // This will show the hour
          height: d.tide_height, // This will show the tide height
        },
        tooltipLeft: xScale(x0),
        tooltipTop: yScale(d.tide_height),
      });
    }
  }, [showTooltip, xScale, yScale, graphData]);
  

  if (width < 10 || height < 10) return null;

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="url(#area-background-gradient)" rx={14} />
        <LinearGradient id="area-background-gradient" from="#3b6978" to="#204051" />
        <LinearGradient id="area-gradient" from="#edffea" to="#edffea" toOpacity={0.05} />
        <GridRows left={margin.left} scale={yScale} width={innerWidth} strokeDasharray="0,1" stroke="#edffea" />
        <GridColumns
          top={margin.top}
          scale={xScale}
          height={innerHeight}
          strokeDasharray="0,1"
          stroke="#edffea"
          tickValues={[...Array(24).keys()]} // Display 24 ticks (one for each hour)
        />
        {[...Array(24).keys()].map((hour) => (
          <text
            key={hour}
            x={xScale(hour)}
            y={innerHeight + margin.top + 15} // Adjust position
            textAnchor="middle"
            fill="#edffea"
            fontSize={10}
          >
            {String(hour).padStart(2, '0')}:00
          </text>
        ))}



        <AreaClosed
          data={graphData}
          x={(d) => xScale(parseInt(d.graph_time.split(':')[0]))}
          y={(d) => yScale(d.tide_height)}
          yScale={yScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveBasis}  
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
          onMouseLeave={hideTooltip}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke="#ffffff"
              strokeWidth={1}
              strokeDasharray="1,0"
            />
            <circle cx={tooltipLeft} cy={tooltipTop} r={4} fill="#536c82" stroke="white" strokeWidth={1} />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
            {`${tooltipData.height} ft`}
          </TooltipWithBounds>
          <Tooltip top={innerHeight + margin.top - 14} left={tooltipLeft} style={{ ...defaultStyles, minWidth: 72 }}>
            {`${String(tooltipData.time).padStart(2, '0')}`}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
