'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { PackageBooking } from "@/types/packageBookings";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCart } from '@/context/CartContext';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';

interface PackageDetailClientProps {
  packageDetail: PackageBooking;
}

const PackageDetailClient: React.FC<PackageDetailClientProps> = ({ packageDetail }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const { addToCart } = useCart();

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
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % packageDetail.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + packageDetail.images.length) % packageDetail.images.length);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start] = dates;
    if (start) {
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + packageDetail.days - 1);
      setStartDate(start);
      setEndDate(endDate);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handleBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select travel dates.");
      return;
    }

    const bookingDates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      bookingDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    
    const bookingData: Omit<PackageBooking, 'id'> = {
      packageId: packageDetail.id,
      userId: userId || "guest", // Use "guest" if the user is not logged in
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests,
      totalPrice: guests * packageDetail.price,
      images: packageDetail.images,
      price: packageDetail.price,
      days: packageDetail.days,
    };

    addToCart({ ...bookingData, id: '' }); // Add the booking to the cart
    
    toast.error("Booking added to cart!");
  };

  const calculateTotalAmount = () => {
    return guests * packageDetail.price;
  };

  const incrementGuests = () => {
    setGuests(guests + 1);
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  if (!packageDetail.images || packageDetail.images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      <div className="col-span-4 md:col-span-2 lg:col-span-2">
        <Image
          src={packageDetail.images[0]}
          alt={`Image 0`}
          className="object-cover aspect-video rounded cursor-pointer hover:opacity-70 h-full"
          height={1000}
          width={1000}
          onClick={() => handleOpenModal(0)}
          priority={true}
        />
      </div>
      <div className="col-span-4 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-3 h-2/3">
        {packageDetail.images.slice(1, 5).map((url, index) => (
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
              src={packageDetail.images[currentImageIndex]}
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
          <div className="w-2/3">
            <label className="block font-bold text-gray-700 mb-3">
              Travel dates
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              className="p-2 border border-gray-300 rounded w-full"
              placeholderText="Select dates"
            />
          </div>
          <div className="w-1/3">
            <label className="block font-bold text-gray-700 mb-3">
              People
            </label>
            <div className="flex items-center">
              <button onClick={decrementGuests} className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l">
                -
              </button>
              <input
                type="number"
                value={guests.toString()}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                min={1}
                className="p-2 border border-gray-300 rounded-none w-full text-center"
              />
              <button onClick={incrementGuests} className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
        
      <div className="col-span-4 md:col-span-2 pt-3">
        <button onClick={handleBooking} className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80">
          Add to Cart
        </button>
        <div className="flex pt-5">
          <p className="text-lg font-semibold pb-3">Total Amount: ${calculateTotalAmount()}</p>
          <p className="text-black dark:text-white block flex-1 text-right md:text-right font-semibold text-lg">${packageDetail.price} per package</p>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailClient;