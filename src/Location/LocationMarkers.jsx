import { useEffect } from 'react';
import Radar from 'radar-sdk-js';


export function LocationMarkers({ map, locations, zoomlevel, onMarkerClick }) {
  useEffect(() => {
    console.log('Locations:', locations); // Check location objects

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

          // Click handler with log
          // Update this click handler to call onMarkerClick with location ID
          marker.getElement().addEventListener('click', () => {
            onMarkerClick(location.id); // Use `id` instead of `location_id`
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
        markers.forEach(marker => marker.remove());
        map.off('zoomend', onZoomEnd);
      };
    }
  }, [map, locations, zoomlevel, onMarkerClick]);

  return null;
}
