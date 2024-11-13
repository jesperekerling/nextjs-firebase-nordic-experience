'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: 'calc(50vh - 64px)',
};

interface GoogleMapsProps {
  lat: number;
  lng: number;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ lat, lng }) => {
  const center = {
    lat,
    lng,
  };

  // Check if lat and lng are valid numbers
  if (isNaN(lat) || isNaN(lng)) {
    return <div>Invalid location data</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMaps;