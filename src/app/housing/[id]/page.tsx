'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";
import Link from 'next/link';
import Modal from '@/components/Modal';
import Image from 'next/image';
import GoogleMaps from '@/components/GoogleMaps';

const HousingDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [housing, setHousing] = useState<Housing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

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
          const housingData = { id: docSnap.id, ...docSnap.data() } as Housing;
          setHousing(housingData);
          fetchCoordinates(housingData.address);
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

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setLat(location.lat);
        setLng(location.lng);
      } else {
        console.error("No results found for the address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

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
              <div className="col-span-4 md:col-span-2 lg:col-span-2 relative">
                <Image
                  src={housing.images[0]}
                  width={1000}
                  height={1000}
                  alt={`Image of ${housing.name}`}
                  className="w-full aspect-video object-cover rounded cursor-pointer"
                  onClick={() => handleOpenModal(0)}
                />
                <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                  {housing.city}
                </span>
              </div>
              <div className="col-span-4 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-3">
                {housing.images.slice(1, 5).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    width={600}
                    height={600}
                    alt={`Image of ${housing.name}`}
                    className="w-full aspect-video object-cover rounded cursor-pointer"
                    onClick={() => handleOpenModal(index + 1)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex">
            <p className="my-5 text-left">
              <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold mr-4">{housing.city}</span>
              <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold">Max Guests: {housing.maxGuests}</span>
            </p>
            <p className="my-5 text-black flex-auto text-right font-bold px-1">${housing.pricePerNight} per night</p>
          </div>
          <p className="mt-5 whitespace-pre-wrap">{housing.description}</p>
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
          {lat && lng && (
            <section>
              <h2 className="font-semibold pt-5 pb-3 text-xl md:text-2xl">Location</h2>
              <GoogleMaps lat={lat} lng={lng} />
            </section>
          )}
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