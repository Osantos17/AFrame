import './MapHome.css';
import { useState, useEffect } from "react";
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css';
import styled from 'styled-components';
import { LocationMarkers } from './LocationMarkers';
import { LocationDetails } from './LocationDetails';

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
  const [selectedLocationId, setSelectedLocationId] = useState(null); // State for selected location

  // Function to find the closest location
  const findClosestLocation = (userCoordinates, locations) => {
    let closestLocation = null;
    let closestDistance = Infinity;

    locations.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(location.latitude - userCoordinates.latitude, 2) +
        Math.pow(location.longitude - userCoordinates.longitude, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestLocation = location;
      }
    });

    return closestLocation;
  };

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

        // Set initial location as the closest to the user's coordinates
        if (coordinates.latitude && coordinates.longitude) {
          const closestLocation = findClosestLocation(coordinates, data);
          if (closestLocation) {
            setSelectedLocationId(closestLocation.id);
          }
        }
      })
      .catch((error) => console.error('Error fetching locations:', error));
  }, [coordinates]);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude && locations.length > 0 && !map) {
      const newMap = Radar.ui.map({
        container: 'map',
        center: [coordinates.longitude, coordinates.latitude],
        zoom: zoomlevel,
      });
      setMap(newMap);

      const userMarker = Radar.ui.marker({
        url: './src/Images/CurrentLocation.png',
        width: '14px',
        height: '14px',
      })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(newMap);

      setCurrentLocationMarker(userMarker);

      newMap.on('zoomend', () => {
        const currentZoom = newMap.getZoom();
        setZoomLevel(currentZoom);
      });

      newMap.fitToMarkers({ maxZoom: 11, padding: 40 });
    }
  }, [coordinates, locations, map]);

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
      {zoomlevel >= 10 && (
        <>
          <LocationDetails selectedLocationId={selectedLocationId} /> {/* Render LocationDetails */}
        </>
      )}
    </div>
  );
}
