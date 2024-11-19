'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import Link from 'next/link';
import { Booking } from "@/types/booking";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = "currentUserId"; // Replace with the actual user ID
      const bookingsCollection = collection(db, "bookings");
      const q = query(bookingsCollection, where("userId", "==", userId));
      const bookingsSnapshot = await getDocs(q);
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
    };

    fetchBookings();
  }, []);

  if (bookings.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id} className="mb-4">
            <p>Housing: {booking.housingId}</p>
            <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Guests: {booking.guests}</p>
            <p>Total Price: ${booking.totalPrice}</p>
            <Link href={`/housing/${booking.housingId}`} className="text-primary hover:underline">
              View Housing
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;