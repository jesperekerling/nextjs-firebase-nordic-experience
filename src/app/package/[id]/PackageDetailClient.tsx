'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';

interface PackageDetailClientProps {
  images: string[];
}

const PackageDetailClient: React.FC<PackageDetailClientProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpenModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4 md:col-span-2 lg:col-span-2">
        <Image
          src={images[0]}
          alt={`Image 0`}
          className="object-cover aspect-square w-full h-full rounded cursor-pointer"
          height={1000}
          width={1000}
          onClick={() => handleOpenModal(0)}
        />
      </div>
      <div className="col-span-4 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2">
        {images.slice(1, 5).map((url, index) => (
          <Image
            key={index + 1}
            src={url}
            height={500}
            width={500}
            alt={`Image ${index + 1}`}
            className="object-cover aspect-square w-full h-full rounded cursor-pointer"
            onClick={() => handleOpenModal(index + 1)}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="relative">
            <Image
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
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
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PackageDetailClient;