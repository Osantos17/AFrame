import { useState, useEffect } from 'react';

export function Fetch() {
  const [locations, setLocations] = useState([]);
  const [surfData, setSurfData] = useState([]);

  useEffect(() => {
    const fetchSurfData = async () => {
      try {
        // Fetch locations from Flask API
        const locationsResponse = await fetch('http://127.0.0.1:5000/locations');
        const locationsData = await locationsResponse.json();
        setLocations(locationsData);
        
        // Fetch surf data from Flask API
        const surfDataResponse = await fetch('http://127.0.0.1:5000/surf-data');
        const surfDataResult = await surfDataResponse.json();
        setSurfData(surfDataResult);
      } catch (error) {
        console.error('Error Fetching data:', error);
      }
    };

    fetchSurfData(); 
  }, []);

  return (
    <div>
      <h1>Surf Locations and Data</h1>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            <h2>{location.location_name}</h2>
            <p>Lat: {location.latitude}, Lng: {location.longitude}</p>
            {surfData.filter(data => data.location_id === location.id).map((data, index) =>(
              <div key={index}>
                <p>Date: {data.date}</p>
                <p>Temperature: {data.tempF}°F</p>
                <p>Wind Speed: {data.windspeedMiles} mph</p>
                <p>Swell Height: {data.swellHeight_ft} ft</p>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
