'use client';

import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: 'calc(50vh - 64px)',
};

interface GoogleMapsProps {
  lat: number;
  lng: number;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ lat, lng }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const center = {
    lat,
    lng,
  };

  if (isNaN(lat) || isNaN(lng)) {
    return <div>Invalid location data</div>;
  }

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default GoogleMaps;