import { useEffect, useState } from 'react';
import LineGraph from 'react-line-graph'


export function TideLongGraphPage() {
  const [tideData, setTideData] = useState([]);
  const [boundaryTideData, setBoundaryTideData] = useState([]);
  const locationId = 1; 

  useEffect(() => {
    const fetchTideData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/combined-tide-data/${locationId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the data to inspect its structure

        // Assuming tide_data and boundary_tide_data are arrays in the fetched data
        if (data.tide_data) {
          setTideData(data.tide_data);
        } else {
          console.warn("Tide data is not in expected format or missing.");
          setTideData([]);
        }

        if (data.boundary_tide_data) {
          setBoundaryTideData(data.boundary_tide_data);
        } else {
          console.warn("Boundary tide data is not in expected format or missing.");
          setBoundaryTideData([]);
        }

      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    fetchTideData();
  }, [locationId]); // Including locationId as a dependency

  return (
    <div>
      <h1>Tide Long Graph</h1>
      <TideLongGraph tideData={tideData} boundaryTideData={boundaryTideData} />
    </div>
  );
}
