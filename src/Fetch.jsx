import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient('https://surforecast.supabase.co', 'public-anon-key');

export function Fetch() {
  const [locations, setLocations] = useState([]);
  const [surfData, setSurfData] = useState([]);

  useEffect(() => {
    const fetchSurfData = async () => {
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*');

      if (locationsError) {
        console.error('Error Fetching locations:', locationsError);
      } else {
        setLocations(locationsData);
      }

      const { data: surfDataResult, error: surfError } = await supabase
        .from('surf_data')
        .select('*');

      if (surfError) {
        console.error('Error fetching surf data:', surfError);
      } else {
        setSurfData(surfDataResult);
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
