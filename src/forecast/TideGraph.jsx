import React from 'react';
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

  // LineGraph configuration
  const graphProps = {
    data: tideHeights, // Use tide heights as y-values
    smoothing: 0.3,
    accent: 'palevioletred',
    fillBelow: 'rgba(200,67,23,0.1)',
    hover: true,
    gridY: true, // Display horizontal grid lines for readability
    width: '100%',
    height: '200px'
  };

  return (
    <div>
      <h3>Tide Data for {surfDate.toDateString()}</h3>
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
    </div>
  );
}
