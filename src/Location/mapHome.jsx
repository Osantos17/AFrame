import React from 'react';
import Radar from 'radar-sdk-js';
import 'radar-sdk-js/dist/radar.css'

export function mapHome () {

  class RadarMap extends React.Component {
    componentDidMount() {
      Radar.initialize();

      const map = Radar.ui.map({
        container: 'map',
      });

      map.on('click', (e) => {
        const {lng, lat} = e.lngLat;

        const marker = Radar.ui.marker()
          setLngLat([lng, lat])
          .addTo(map);

        map.fitToMarkets ({ maxZoom: 14, padding: 80 });

        marker.on('click', (e) => {
          marker.remove();
          map.fitToMarkers({ maxZoom: 14, padding: 80 });
        });
      });
    };
  }
};
