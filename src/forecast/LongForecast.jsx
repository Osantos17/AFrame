import { useEffect, useState } from 'react';

export function LongForecast({ selectedLocationId }) {
    console.log('LongForecast received selectedLocationId:', selectedLocationId); // Log received ID
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/locations/combined-data');
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const selectedLocation = data.find(location => location.location_id === selectedLocationId);
  
    return (
      <div>
        {selectedLocation ? (
          <div key={selectedLocation.location_id}>
            <h2>{selectedLocation.location_name}</h2>
            <h3>Surf Data</h3>
            {selectedLocation.surf_data.map(surf => (
              <div key={surf.id}>
                <p>Date: {surf.date}</p>
                <p>Swell Direction: {surf.swellDir} ({surf.swellDir16Point})</p>
                <p>Swell Height: {surf.swellHeight_ft} ft</p>
                <p>Time: {surf.time}</p>
                <p>Wind Direction: {surf.winddirDegree}° ({surf.winddir16point})</p>
                <p>Wind Speed: {surf.windspeedMiles} mph</p>
              </div>
            ))}
            <h3>Tide Data</h3>
            {selectedLocation.tide_data.map(tide => (
              <div key={tide.id}>
                <p>Tide Height: {tide.tide_height} ft</p>
                <p>Tide Time: {tide.tide_time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Select a location on the map to view surf data</p>
        )}
      </div>
    );
  }
  