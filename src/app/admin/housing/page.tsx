'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "@/types/housing";

const HousingListPage = () => {
  const [housingList, setHousingList] = useState<Housing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHousingList();
  }, []);

  const fetchHousingList = async () => {
    try {
      const housingCollection = collection(db, "housing");
      const housingSnapshot = await getDocs(housingCollection);
      const housingData = housingSnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        ...doc.data()
      } as Housing));
      console.log('Fetched housing data:', housingData);
      setHousingList(housingData);
    } catch (error) {
      setError("Failed to fetch housing list.");
      console.error("Error fetching housing list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pb-20 font-[family-name:var(--font-geist-sans)]">
      <section className="text-center">
        <h1 className="text-2xl font-bold">Housing List</h1>
        <ul className="py-5 flex gap-5">
          <li>
            <Link href="/admin/" className="hover:underline">
              Back to Admin
            </Link>
          </li>
          <li>
            <Link href="/admin/housing/add" className="hover:underline">
              Create a new housing option
            </Link>
          </li>
          <li>
            <Link href="/admin/add-images" className="hover:underline">
              Upload images
            </Link>
          </li>
        </ul>
      </section>
      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {housingList.map(housing => (
            <div key={housing.id} className="relative rounded">
              {housing.images && housing.images.length > 0 && (
                <img src={housing.images[0]} alt={`Thumbnail of ${housing.name}`} className="w-full h-48 object-cover mb-1 rounded" />
              )}
              <h2 className="text-lg font-bold py-2">{housing.name}</h2>
              <p className="text-sm truncate">{housing.description}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400 pt-1">${housing.pricePerNight}/night</p>
              <Link href={`/admin/housing/edit/${housing.id}`} className="hover:opacity-65">
                <button className="mt-2 px-3 py-2 bg-primary text-white rounded">Edit</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HousingListPage;