'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { Housing } from "@/types/housing";

interface HousingDetailClientProps {
  housing: Housing;
  lat: number;
  lng: number;
}

const HousingDetailClient: React.FC<HousingDetailClientProps> = ({ housing }) => {
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
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % housing.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + housing.images.length) % housing.images.length);
  };

  if (!housing.images || housing.images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      <div className="col-span-4 md:col-span-2 lg:col-span-2">
        <Image
          src={housing.images[0]}
          alt={`Image 0`}
          className="object-cover aspect-video rounded cursor-pointer hover:opacity-70 h-full"
          height={1000}
          width={1000}
          onClick={() => handleOpenModal(0)}
          priority={true}
        />
      </div>
      <div className="col-span-4 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-3 h-2/3">
        {housing.images.slice(1, 5).map((url, index) => (
          <Image
            key={index + 1}
            src={url}
            height={500} 
            width={500}
            alt={`Image ${index + 1}`}
            className="object-cover aspect-video w-full rounded cursor-pointer hover:opacity-70"
            onClick={() => handleOpenModal(index + 1)}
            priority={true}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="relative">
            <Image
              src={housing.images[currentImageIndex]}
              alt={`Image ${currentImageIndex}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority={true}
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full font-bold"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full font-bold"
            >
              &gt;
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HousingDetailClient;