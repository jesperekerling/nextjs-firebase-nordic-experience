'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ThumbnailNavigatorProps {
  images: string[];
  altText: string;
  isAboveFold?: boolean; // Add a new prop to indicate if the image is above the fold
  category: string;
}

const ThumbnailNavigator: React.FC<ThumbnailNavigatorProps> = ({ images, altText, isAboveFold = false, category }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="relative" onClick={handleClick}>
      <Image
        src={images[currentImageIndex]}
        alt={altText}
        width={500}
        height={300}
        priority={isAboveFold} // Add the priority property
        className="w-full h-48 lg:h-64 xl:h-80 object-cover mt-2 rounded-lg"
      />
      <div className="absolute top-2 right-2 text-sm bg-primary font-semibold px-2 text-white p-1 rounded">
        {category}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white py-3 px-4 rounded-full font-bold"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white py-3 px-4 rounded-full font-bold"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default ThumbnailNavigator;