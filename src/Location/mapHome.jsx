import './MapHome.css';
import { useState, useEffect } from "react";
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import styled from 'styled-components';
import { SurfReport } from "/src/forecast/SurfReport.jsx";

// Styled component for map container
const MapContainer = styled.div`
  height: calc(100vh - 120px - 80px);
  width: 100%;
`;

export function MapHome() {
  const [coordinates, setCoordinates] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    Radar.initialize('prj_live_pk_de82543ab49a7a7b86fc1d55c635cf2af48357e3');

    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/locations')
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    if (coordinates && locations.length > 0) {
      const map = Radar.ui.map({
        container: 'map',
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 10,
      });

      map.on('load', () => {
        Radar.ui.marker({
          url: './src/Images/CurrentLocation.png',
          width: '14px',
          height: '14px',
        })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map);

        locations.forEach((location) => {
          Radar.ui.marker({
            url: './src/Images/Locations.png',
            width: '14px',
            height: '14px',
          })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);
        });
      });

      map.fitToMarkers({ maxZoom: 14, padding: 40 });
    }
  }, [coordinates, locations]);

  return (
    <div className="radar-map-page flex flex-col h-full">
      <MapContainer>
        <div id="map" className='h-full w-full'></div>
      </MapContainer>
      <SurfReport />
    </div>
  );
}

export default MapHome;
