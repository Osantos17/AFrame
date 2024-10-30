// LocationMarkers.jsx
import { useEffect } from 'react';
import Radar from 'radar-sdk-js';


export function LocationMarkers({ map, locations, zoomlevel }) {
  useEffect(() => {
    if (map && locations.length > 0) {
      const addMarkers = () => {
        const markers = locations.map(location => {
          const marker = Radar.ui.marker({
            url: './src/Images/Locations.png',
            width: '14px',
            height: '14px',
          })
            .setLngLat([location.longitude, location.latitude])
            .addTo(map);

          marker.getElement().addEventListener('click', () => {
            alert(`You clicked on ${location.name}`);
          });

          return marker;
        });
        return markers;
      };

      let markers = [];
      if (zoomlevel >= 10) {
        markers = addMarkers();
      }

      const onZoomEnd = () => {
        const currentZoom = map.getZoom();
        if (currentZoom < 10) {
          markers.forEach(marker => marker.remove());
          markers = [];
        } else if (markers.length === 0) {
          markers = addMarkers();
        }
      };

      map.on('zoomend', onZoomEnd);

      return () => {
        // Cleanup on unmount
        markers.forEach(marker => marker.remove());
        map.off('zoomend', onZoomEnd);
      };
    }
  }, [map, locations, zoomlevel]);

  return null; // No additional UI needed
}
