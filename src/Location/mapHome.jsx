import { useState, useEffect } from "react";
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import styled from 'styled-components';

// Styled component for map container
const MapContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

export function MapHome() {
  const [coordinates, setCoordinates] = useState(null);
  // const [markers, setMarkers] = useState([]);

  useEffect(() => {
    Radar.initialize('prj_live_pk_de82543ab49a7a7b86fc1d55c635cf2af48357e3'); // Ensure actual API key is placed here

    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (coordinates) {
      const map = Radar.ui.map({
        container: 'map',
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 10,
      });

      // const userMarker = new Radar.ui.marker({ text: 'You' })
      //   .setLngLat([coordinates.longitude, coordinates.latitude])
      //   .addTo(map);

      map.fitToMarkers({ maxZoom: 14, padding: 80 });

      // markers.forEach((marker) => {
      //   Radar.ui.marker({ text: marker.name })
      //     .setLngLat([marker.lngLat[0], marker.lngLat[1]])
      //     .addTo(map);
      // });
    }
  }, [coordinates]);

  // Add marker example function
  // const addMarker = (lng, lat, name) => {
  //   setMarkers((prevMarkers) => [...prevMarkers, { name, lngLat: [lng, lat] }]);
  // };

  return (
    <div className="radar-map-page">
      <MapContainer>
        <div id="map" style={{ height: '100%', width: '100%' }}></div>
      </MapContainer>
    </div>
  );
}

export default MapHome;
