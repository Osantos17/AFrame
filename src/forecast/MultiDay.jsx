import { useEffect, useState } from 'react';
import { TimedGraph } from './TimedGraph';
import { ForecastSingle } from "./ForecastSingle.jsx";
import './Multiday.css';

export function MultiDay() {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate size based on window width (for example, 80% of the width)
  const graphWidth = windowWidth * 0.8;
  const graphHeight = graphWidth / 1; // Adjust the aspect ratio as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/graph-points/1'); // Adjust endpoint as needed
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const json = await response.json();
        console.log('Fetched 7-day data for location 1:', json);

        // Find the first "00:00" to determine start
        const startEntry = json.find((item) => item.graph_time === '00:00');
        const startId = startEntry ? startEntry.id : null;

        // Filter starting from "00:00"
        const filteredData = startId ? json.filter((item) => item.id >= startId) : json;

        // Split data into daily chunks
        const graphDataChunks = [];
        let currentChunk = [];

        filteredData.forEach((item) => {
          if (item.graph_time === '00:00' && currentChunk.length > 0) {
            graphDataChunks.push(currentChunk);
            currentChunk = [];
          }
          currentChunk.push(item);
        });

        if (currentChunk.length > 0) {
          graphDataChunks.push(currentChunk);
        }

        // Filter to hourly entries only (this ensures that only hourly data is considered)
        const filteredGraphDataChunks = graphDataChunks.map((chunk) =>
          chunk.filter((item) => item.graph_time.slice(3) === '00')
        );

        console.log('Filtered graph data chunks:', filteredGraphDataChunks);

        setData(filteredData);
        setGraphData(filteredGraphDataChunks);
        setIsLoading(false); // Set loading state to false after fetching data
      } catch (error) {
        console.error('Error fetching 7-day data:', error);
        setIsLoading(false); // Ensure loading state is false on error
      }
    };

    fetchData();
  }, []);

  // Tooltip Handlers
  const handleMouseEnter = (event, dataPoint) => {
    if (!dataPoint) return;
    setTooltip({
      visible: true,
      content: `Time: ${dataPoint.graph_time} - Tide Height: ${dataPoint.tide_height}`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // Render each day's graph
  const renderGraph = (dayData, index) => {
    if (!dayData || dayData.length === 0) {
      return <p key={index}>No data available for Day {index + 1}</p>;
    }

    return (
      <div key={index} style={{ marginBottom: '30px' }}>
        <div >
          <TimedGraph
            width={800}
            height={400}
            graphData={dayData}
            handleMouseEnter={handleMouseEnter} // Pass tooltip handlers
            handleMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="multiday-container flex flex-col items-center justify-center">
      <div className="multiday-container">
      <div className="graph-wrapper ">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          graphData.map((dayData, index) => (
            <div key={index} className="graph-container ">
              <TimedGraph
                width={graphWidth}  // Pass the calculated width
                height={graphHeight}  // Pass the calculated height
                graphData={dayData}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </div>
          ))
        )}
        < ForecastSingle/>
      </div>
      </div>
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
