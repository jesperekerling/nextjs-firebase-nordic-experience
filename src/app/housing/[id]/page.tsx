'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";
import Link from 'next/link';

const HousingDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [housing, setHousing] = useState<Housing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {housing.images.map((image, index) => (
                <img key={index} src={image} alt={`Image of ${housing.name}`} className="w-full h-48 object-cover rounded" />
              ))}
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
    </div>
  );
};

export default HousingDetailPage;