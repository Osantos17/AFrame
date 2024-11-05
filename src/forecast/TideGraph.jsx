import { useState } from 'react';
import LineGraph from 'react-line-graph';

export function TideGraph({ tideData, surfDate }) {
  if (!surfDate) return null;

  // Filter tide data for the selected date
  const tidesForFirstDate = tideData.filter(tide => {
    const tideDate = new Date(tide.tide_date);
    return (
      tideDate.getMonth() === surfDate.getMonth() &&
      tideDate.getDate() === surfDate.getDate()
    );
  });

  if (tidesForFirstDate.length === 0) {
    return <p>No tide data available for this date.</p>;
  }

  const tideHeights = tidesForFirstDate.map(tide => parseFloat(tide.tide_height));

  // State to keep track of the hovered tide data
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
        setHoveredTide(tidesForFirstDate[index]);
      } else {
        setHoveredTide(null);
      }
    },
  };

  return (
    <div>
      <div>
        {tidesForFirstDate.map(tide => (
          <div key={tide.id} style={{ marginBottom: '1rem' }}>
            <p><strong>Height:</strong> {tide.tide_height}</p>
            <p><strong>Time:</strong> {tide.tide_time}</p>
            <p><strong>Type:</strong> {tide.tide_type}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Tide Height Graph (3 AM - 9 PM)</h3>
        <LineGraph {...graphProps} />
      </div>

      {hoveredTide && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>Hovered Tide Data:</h4>
          <p><strong>Height:</strong> {hoveredTide.tide_height}</p>
          <p><strong>Time:</strong> {hoveredTide.tide_time}</p>
          <p><strong>Type:</strong> {hoveredTide.tide_type}</p>
        </div>
      )}
    </div>
  );
}
