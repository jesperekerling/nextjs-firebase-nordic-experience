'use client'

import React from 'react'
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

const center = {
  lat: 62.9223,
  lng: 14.3014,
};

const items = [{
  lat: 62.9223,
  long: 14.3014,
},
{
  lat: 62.9223,
  long: 14.3014,
},
{
  lat: 62.9223,
  long: 14.3014,
},
{
  lat: 62.9223,
  long: 14.3014,
}
];


function GMapsExample() {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {items.map((item, index) => (
          <Marker
            key={index}
            position={{
              lat: item.lat,
              lng: item.long,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default GMapsExample