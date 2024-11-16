'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHousing } from '@/utils/fetchHousing';
import { Housing } from '@/types/housing';
import Image from 'next/image';

const HousingList = () => {
  const [housingList, setHousingList] = useState<Housing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHousing = async () => {
      try {
        const data = await fetchHousing();
        setHousingList(data);
      } catch (error) {
        setError("Failed to fetch housing list.");
        console.error("Error fetching housing list:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHousing();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pb-20 font-[family-name:var(--font-geist-sans)]">
      <section className="text-center">
        <h1 className="text-2xl font-bold">Housing</h1>
        <p className="text-grey2 dark:text-gray-200 py-3">Select a housing option from our list. (optional)</p>
      </section>
      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {housingList.map(housing => (
            <div key={housing.id} className="relative rounded">
              {housing.images && housing.images.length > 0 && (
                <Image
                  src={housing.images[0]}
                  alt={`Image of ${housing.name}`}
                  className="w-full h-48 object-cover mb-4 rounded"
                  width={1000}
                  height={1000}
                />
              )}
              <Link href={`/housing/${housing.id}`} className="hover:opacity-65">
                <h2 className="text-lg font-bold py-3">{housing.name}</h2>
                <p className="text-sm">{housing.description}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400 pt-1">${housing.pricePerNight}/night</p>
                <div className="mt-2 text-xs">
                  <h3 className="font-semibold">Availability:</h3>
                  <ul className="list-disc list-inside">
                    {housing.availability && housing.availability.length > 0 ? (
                      housing.availability.map((availability, index) => (
                        <li key={index}>
                          <strong>{availability.date}</strong> - {availability.available ? "Available" : "Not Available"}
                        </li>
                      ))
                    ) : (
                      <li>No availability information.</li>
                    )}
                  </ul>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HousingList;