'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { Housing } from "@/types/housing";
import { Booking } from "@/types/bookings";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface HousingDetailClientProps {
  housing: Housing;
  lat: number;
  lng: number;
}

const HousingDetailClient: React.FC<HousingDetailClientProps> = ({ housing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select travel dates.");
      return;
    }

    if (!userId) {
      alert("Please log in to book housing.");
      return;
    }

    const bookingDates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      bookingDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("Selected Dates:", bookingDates);
    console.log("Housing Availability:", housing.availability);

    const unavailableDates = housing.availability.filter(avail => !avail.available).map(avail => avail.date);
    const isAvailable = bookingDates.every(date => !unavailableDates.includes(date));

    if (!isAvailable) {
      alert("Some of the selected dates are not available.");
      return;
    }

    try {
      const bookingData: Omit<Booking, 'id'> = {
        housingId: housing.id,
        userId: userId, // Use the authenticated user's ID
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
        totalPrice: bookingDates.length * housing.pricePerNight,
      };

      await addDoc(collection(db, "bookings"), bookingData);

      // Update housing availability
      const updatedAvailability = [
        ...housing.availability,
        ...bookingDates.map(date => ({ date, available: false }))
      ];

      const housingRef = doc(db, "housing", housing.id);
      await updateDoc(housingRef, { availability: updatedAvailability });

      alert("Booking successful!");
      router.push("/checkout");
    } catch (error) {
      console.error("Error booking housing:", error);
      alert("Failed to book housing.");
    }
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return housing.availability.some(avail => avail.date === dateString && !avail.available);
  };

  const getDayClassName = (date: Date) => {
    return isDateUnavailable(date) ? 'unavailable-date' : '';
  };

  const calculateTotalAmount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days * housing.pricePerNight;
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
      
      <div className="col-span-4 md:col-span-2">
        <div className="flex gap-5 pb-5 p-3 rounded">
          <div>
            <label className="block font-bold text-gray-700 mb-3">
              Travel dates
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              filterDate={(date) => !isDateUnavailable(date)}
              dayClassName={getDayClassName}
              className="p-2 border border-gray-300 rounded w-full"
              placeholderText="Select dates"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-3">
              People
            </label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min={1}
              max={housing.maxGuests}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
      </div>
        
        <div className="col-span-4 md:col-span-2 pt-3">
          <button onClick={handleBooking} className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80">
            Book now
          </button>
          <div className="flex pt-5">
            <p className="text-lg font-semibold pb-3">Total Amount: ${calculateTotalAmount()}</p>
            <p className="text-black dark:text-white block flex-1 text-right md:text-right font-semibold text-lg">${housing?.pricePerNight} per night</p>
          </div>

        </div>
    </div>
  );
};

export default HousingDetailClient;