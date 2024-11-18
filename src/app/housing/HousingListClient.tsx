'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Housing } from '@/types/housing';
import Image from 'next/image';
import Filter from '@/components/Filter';

interface HousingListClientProps {
  housingList: Housing[];
}

const HousingListClient: React.FC<HousingListClientProps> = ({ housingList }) => {
  const [filteredHousingList, setFilteredHousingList] = useState<Housing[]>(housingList);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number>(1);

  useEffect(() => {
    if (housingList.length > 0) {
      setMaxGuests(Math.max(...housingList.map(h => h.maxGuests)));
    }
  }, [housingList]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredList = housingList.filter(housing => {
        const availability = housing.availability.find(avail => {
          const availDate = new Date(avail.date);
          return availDate >= startDate && availDate <= endDate && avail.available && housing.maxGuests >= guests;
        });
        return availability;
      });
      setFilteredHousingList(filteredList);
    } else {
      setFilteredHousingList(housingList);
    }
  }, [startDate, endDate, guests, housingList]);

  return (
    <>
      <Filter onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }} onGuestsChange={setGuests} maxGuests={maxGuests} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredHousingList.map(housing => (
          <div key={housing.id} className="relative rounded">
            <div className="relative">
              {housing.images && housing.images.length > 0 && (
                <Image src={housing.images[0]} alt={housing.name} className="w-full h-48 object-cover rounded" width={500} height={300} />
              )}
              <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                {housing.city}
              </span>
            </div>
            <Link href={`/housing/${housing.id}`} className="hover:opacity-65">
              <h2 className="text-lg font-bold py-1">{housing.name}</h2>
              <p className="text-sm truncate">{housing.description}</p>
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
    </>
  );
};

export default HousingListClient;