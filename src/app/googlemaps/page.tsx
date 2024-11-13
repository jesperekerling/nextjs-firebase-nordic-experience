import React from 'react';
import GMapsExample from '@/components/GoogleMaps';

function Page() {
  const defaultLat = 55.672112;
  const defaultLng = 12.521130;

  return (
    <GMapsExample lat={defaultLat} lng={defaultLng} />
  );
}

export default Page;