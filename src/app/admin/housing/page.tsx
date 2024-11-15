'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Housing } from "../../../types/housing";
import Link from 'next/link';

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
      const housingData = housingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Housing));
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Housing List</h1>
      <ul>
        {housingList.map(housing => (
          <li key={housing.id} className="border p-2 rounded mb-2">
            <h2 className="text-lg font-bold">{housing.name}</h2>
            <p>{housing.city}</p>
            <p>{housing.address}</p>
            <p>{housing.description}</p>
            <p>Price Per Night: ${housing.pricePerNight}</p>
            <Link href={`/admin/housing/edit/${housing.id}`}>
              <button className="p-2 bg-blue-500 text-white rounded">Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HousingListPage;