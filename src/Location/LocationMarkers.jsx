import { useEffect } from 'react';
import Radar from 'radar-sdk-js';

export function LocationMarkers({ map, locations, zoomlevel, onMarkerClick }) {
  useEffect(() => {
    if (map && locations.length > 0) {
      let markers = [];

      const addMarkers = () => {
        markers = locations.map(location => {
          const marker = Radar.ui.marker({
            url: './src/Images/Locations.png',
            width: '14px',
            height: '14px',
          })
            .setLngLat([location.longitude, location.latitude])
            .addTo(map);

          marker.getElement().addEventListener('click', () => {
            onMarkerClick(location); // Pass the entire location object here
          });

          return marker;
        });
      };

      if (zoomlevel >= 10) {
        addMarkers();
      }

      const onZoomEnd = () => {
        const currentZoom = map.getZoom();
        if (currentZoom < 10) {
          markers.forEach(marker => marker.remove());
          markers = [];
        } else if (markers.length === 0) {
          addMarkers();
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
