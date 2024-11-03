import { useEffect, useState } from 'react';

export function LocationDetails({ selectedLocationId }) {
  const [locationDetails, setLocationDetails] = useState(null);
  const [surfData, setSurfData] = useState([]);
  const [tideData, setTideData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!selectedLocationId) return; // Early exit if no ID

      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/locations/combined-data/${selectedLocationId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLocationDetails(data);
        setSurfData(data.surf_data || []); // Directly set surf data from the response
        setTideData(data.tide_data || []); // Directly set tide data from the response
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
  const currentTime = currentDate.getHours() * 100 + Math.floor(currentDate.getMinutes() / 60 * 100); // e.g., 900 for 9:00 AM
  const firstSurfDate = surfData.length > 0 ? new Date(surfData[0].date) : null; // Convert to Date object

  // Format the date as "MM/DD"
  const formatDate = (date) => {
    const options = { month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  // Check if there is a valid date to format
  const formattedDate = firstSurfDate ? formatDate(firstSurfDate) : '';

  // Find surf data for the first date
  const surfDataForFirstDate = surfData.filter(surf => {
    const surfDate = new Date(surf.date);
    return surfDate.getMonth() === firstSurfDate.getMonth() && surfDate.getDate() === firstSurfDate.getDate();
  });

  // Find the surf data entry closest to the current time
  const closestSurfData = surfDataForFirstDate.reduce((prev, curr) => {
    const prevTime = Math.abs(prev.time - currentTime);
    const currTime = Math.abs(curr.time - currentTime);
    return currTime < prevTime ? curr : prev;
  }, surfDataForFirstDate[0]);

  const tidesForFirstDate = tideData.filter(tide => {
    const tideDate = new Date(tide.tide_date);
    return tideDate.getMonth() === firstSurfDate.getMonth() && tideDate.getDate() === firstSurfDate.getDate();
  }); // Use the correct property

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
      {tidesForFirstDate.length > 0 ? (
        <div>
          {tidesForFirstDate.map(tide => (
            <div key={tide.id}>
              <p>{tide.tide_height}</p>
              <p>{tide.tide_time}</p>
              <p>{tide.tide_type}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tide data available for this date.</p>
      )}
    </div>
  );
}
