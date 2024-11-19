'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Booking } from "../../types/bookings";

const CheckoutPage = () => {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBooking(bookingsData[0]); // Assuming the latest booking is the one to be checked out
    };

    fetchBooking();
  }, []);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p>Housing: {booking.housingId}</p>
      <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
      <p>Guests: {booking.guests}</p>
      <p>Total Price: ${booking.totalPrice}</p>
      <button onClick={() => router.push('/housing')} className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80 mt-5">
        Back to Housing List
      </button>
    </div>
  );
};

export default CheckoutPage;