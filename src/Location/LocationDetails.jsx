import { useEffect, useState } from 'react';
import { TideGraph } from '/src/forecast/TideGraph.jsx';

export function LocationDetails({ selectedLocationId }) {
  const [locationDetails, setLocationDetails] = useState(null);
  const [surfData, setSurfData] = useState([]);
  const [tideData, setTideData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!selectedLocationId) return;

      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/locations/combined-data/${selectedLocationId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLocationDetails(data);
        setSurfData(data.surf_data || []);
        setTideData(data.tide_data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [selectedLocationId]);

  if (loading) return <div>Loading location details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!locationDetails) return <div>No location details available.</div>;

  const currentDate = new Date();
  const currentTime = currentDate.getHours() * 100 + Math.floor(currentDate.getMinutes() / 60 * 100);

  const firstSurfDate = surfData.length > 0 ? new Date(surfData[0].date) : null;
  const formatDate = (date) => date ? date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }) : '';

  const formattedDate = firstSurfDate ? formatDate(firstSurfDate) : '';

  const surfDataForFirstDate = surfData.filter(surf => {
    const surfDate = new Date(surf.date);
    return surfDate.getMonth() === firstSurfDate.getMonth() && surfDate.getDate() === firstSurfDate.getDate();
  });

  const closestSurfData = surfDataForFirstDate.reduce((prev, curr) => {
    const prevTime = Math.abs(prev.time - currentTime);
    const currTime = Math.abs(curr.time - currentTime);
    return currTime < prevTime ? curr : prev;
  }, surfDataForFirstDate[0]);

  return (
    <div className='rounded-xl shadow-lg flex items-center'>
      <div>
        <h3>{locationDetails.location_name}</h3>
        <h3>{formattedDate}</h3>
      </div>
      {closestSurfData ? (
        <div key={closestSurfData.id}>
          <p>{closestSurfData.time}</p>
          <div>
            <h3>Swell</h3>
            <p>{closestSurfData.swellHeight_ft} ft, {closestSurfData.swelldir}, {closestSurfData.swellperiod_secs}</p>
          </div>
          <div>
            <h3>Wind</h3>
            <p>{closestSurfData.windspeedMiles} mph, {closestSurfData.winddirDegree}, {closestSurfData.winddir16point}</p>
          </div>
        </div>
      ) : (
        <p>No surf data available for this date.</p>
      )}
      {/* <TideGraph tideData={tideData} surfDate={firstSurfDate} /> */}
    </div>
  );
}
