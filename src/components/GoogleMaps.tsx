'use client';

import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)',
};

const center = {
  lat: 62.9223,
  lng: 14.3014,
};

const items = [
  { lat: 62.9223, lng: 14.3014 },
  { lat: 62.9223, lng: 14.3014 },
  { lat: 62.9223, lng: 14.3014 },
  { lat: 62.9223, lng: 14.3014 },
];

function GMapsExample() {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const markers = items.map((item) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: item.lat, lng: item.lng },
          map: mapRef.current!,
        });
        return marker;
      });

      return () => {
        markers.forEach((marker) => marker.setMap(null));
      };
    }
  }, [mapRef]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={(map) => (mapRef.current = map)}
      />
    </LoadScript>
  );
}

export default GMapsExample;