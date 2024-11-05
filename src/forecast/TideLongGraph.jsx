import { useState } from 'react';
import LineGraph from 'react-line-graph';

export function TideLongGraph({ tideData, boundaryTideData }) {
  if (!tideData || tideData.length === 0) return <p>No tide data available.</p>;

  // Ensure boundaryTideData is an array
  const boundaryDataArray = Array.isArray(boundaryTideData) ? boundaryTideData : [boundaryTideData];

  // Combine boundary data with tide data for continuity over 3 days
  const combinedTideData = [...boundaryDataArray, ...tideData].filter(item => item && item.tide_date);

  if (combinedTideData.length === 0) {
    return <p>No tide data available for the selected period.</p>;
  }

  // Sort combined data by date to ensure chronological order
  combinedTideData.sort((a, b) => new Date(a.tide_date) - new Date(b.tide_date));

  // Define the target date and set up a 3-day range around it
  const targetDate = new Date(combinedTideData[0].tide_date);
  const startOfThreeDays = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000); // One day before
  const endOfThreeDays = new Date(targetDate.getTime() + 2 * 24 * 60 * 60 * 1000); // Two days after

  // Filter data to display only the 3-day period
  const threeDayData = combinedTideData.filter((tide) => {
    const tideDate = new Date(tide.tide_date);
    return tideDate >= startOfThreeDays && tideDate <= endOfThreeDays;
  });

  // Map data to display tide heights in the graph
  const tideHeights = threeDayData.map(tide => parseFloat(tide.tide_height));

  // State to keep track of hovered tide data
  const [hoveredTide, setHoveredTide] = useState(null);

  // LineGraph configuration
  const graphProps = {
    data: tideHeights,
    smoothing: 0.3,
    accent: 'palevioletred',
    fillBelow: 'rgba(200,67,23,0.1)',
    hover: true,
    gridY: true,
    width: '100%',
    height: '200px',
    onHover: (point) => {
      if (point) {
        const index = point[0];
        setHoveredTide(threeDayData[index]);
      } else {
        setHoveredTide(null);
      }
    },
  };

  return (
    <div>
      <div style={{ marginTop: '2rem' }}>
        <LineGraph {...graphProps} />
      </div>

      {hoveredTide && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>Hovered Tide Data:</h4>
          <p><strong>Height:</strong> {hoveredTide.tide_height} m</p>
          <p><strong>Time:</strong> {hoveredTide.tide_time}</p>
          <p><strong>Type:</strong> {hoveredTide.tide_type}</p>
        </div>
      )}
    </div>
  );
}
