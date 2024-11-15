'use client';
import React, { useEffect } from 'react';
import addHousingData from '../../../utils/addHousingData'; // Correct the import path

function AddHousingData() {
  useEffect(() => {
    addHousingData().catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl py-3">Adding Housing Data...</h1>
    </div>
  );
}

export default AddHousingData;