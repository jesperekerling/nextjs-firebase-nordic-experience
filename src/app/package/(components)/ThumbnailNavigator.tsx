'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ThumbnailNavigatorProps {
  images: string[];
  altText: string;
  isAboveFold?: boolean; // Add a new prop to indicate if the image is above the fold
}

const ThumbnailNavigator: React.FC<ThumbnailNavigatorProps> = ({ images, altText, isAboveFold = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <Image
        src={images[currentImageIndex]}
        alt={altText}
        width={500}
        height={300}
        priority={isAboveFold} // Add the priority property
        className="hover:opacity-90 w-full h-48 object-cover mt-2 rounded"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default ThumbnailNavigator;