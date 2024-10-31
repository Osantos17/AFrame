// MapHome.jsx
import './MapHome.css';
import { useState, useEffect } from "react";
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import styled from 'styled-components';
import { SurfReport } from "/src/forecast/SurfReport.jsx";
import { LocationMarkers } from './LocationMarkers';

const MapContainer = styled.div`
  height: ${({ $zoomlevel }) => ($zoomlevel >= 10 ? 'calc(100vh - 120px - 80px)' : 'calc(100vh - 120px)')};
  width: 100%;
`;

export function MapHome() {
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [locations, setLocations] = useState([]);
  const [zoomlevel, setZoomLevel] = useState(10);
  const [map, setMap] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null); // New state for selected location

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
      .then((data) => setLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude && locations.length > 0 && !map) {
      const newMap = Radar.ui.map({
        container: 'map',
        center: [coordinates.longitude, coordinates.latitude],
        zoom: zoomlevel,
      });
      setMap(newMap);

      // Add the user's current location marker
      const userMarker = Radar.ui.marker({
        url: './src/Images/CurrentLocation.png',
        width: '14px',
        height: '14px',
      })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(newMap);

      setCurrentLocationMarker(userMarker);

      // Handle zoom level changes
      newMap.on('zoomend', () => {
        const currentZoom = newMap.getZoom();
        setZoomLevel(currentZoom);
      });

      newMap.fitToMarkers({ maxZoom: 11, padding: 40 });
    }
  }, [coordinates, locations, map]);

  // Debug log to check if setSelectedLocationId is updating the selected location ID
  useEffect(() => {
    console.log(`Selected Location ID in MapHome: ${selectedLocationId}`);
  }, [selectedLocationId]);

  return (
    <div className="radar-map-page flex flex-col h-full">
      <MapContainer $zoomlevel={zoomlevel}>
        <div id="map" className='h-full w-full'></div>
      </MapContainer>
      <LocationMarkers 
        map={map} 
        locations={locations} 
        zoomlevel={zoomlevel} 
        onMarkerClick={(locationId) => {
          setSelectedLocationId(locationId);
          console.log('Selected Location ID in MapHome:', locationId); // Log selected ID
        }} 
      />
      {zoomlevel >= 10 && <SurfReport selectedLocationId={selectedLocationId} />}
    </div>
  );
  
}
