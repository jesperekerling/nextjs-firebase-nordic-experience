'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";
import Link from 'next/link';
import Modal from '@/components/Modal';
import Image from 'next/image';

const HousingDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [housing, setHousing] = useState<Housing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        if (!id) {
          setError("Invalid housing ID.");
          setLoading(false);
          return;
        }
        const docRef = doc(db, "housing", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHousing({ id: docSnap.id, ...docSnap.data() } as Housing);
        } else {
          setError("Housing not found.");
        }
      } catch (error) {
        setError("Failed to fetch housing.");
        console.error("Error fetching housing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHousing();
  }, [id]);

  const handleOpenModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    if (housing) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % housing.images.length);
    }
  };

  const handlePrevImage = () => {
    if (housing) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + housing.images.length) % housing.images.length);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/housing">
        <button className="bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm md:text-md hover:opacity-80">
          Back to housing list
        </button>
      </Link>
      {housing && (
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-7 md:my-10">{housing.name}</h1>
          {housing.images && housing.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              <div className="col-span-4 md:col-span-2 lg:col-span-2">
                <img
                  src={housing.images[0]}
                  alt={`Image of ${housing.name}`}
                  className="w-full h-auto object-cover rounded cursor-pointer"
                  onClick={() => handleOpenModal(0)}
                />
              </div>
              <div className="col-span-4 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-3">
                {housing.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image of ${housing.name}`}
                    className="w-full h-auto object-cover rounded cursor-pointer"
                    onClick={() => handleOpenModal(index + 1)}
                  />
                ))}
              </div>
            </div>
          )}
          <p className="mt-5">{housing.description}</p>
          <div className="flex py-5">
            <p className="text-md md:text-lg flex-auto">{housing.address}</p>
            <p className="text-black flex-auto text-right font-bold px-1">${housing.pricePerNight} per night</p>
          </div>
          <p className="my-5">
            <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold">{housing.city}</span>
          </p>
          <div className="mt-2">
            <h2 className="font-semibold pt-5 pb-3 text-xl md:text-2xl">Availability</h2>
            <ul className="list-disc list-inside">
              {housing.availability && housing.availability.length > 0 ? (
                housing.availability.map((availability, index) => (
                  <li key={index} className="py-3">
                    <strong>{availability.date}</strong> - {availability.available ? "Available" : "Not Available"}
                  </li>
                ))
              ) : (
                <li>No availability information.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {housing && (
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
        )}
      </Modal>
    </div>
  );
};

export default HousingDetailPage;