'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Booking } from "@/types/bookings";
import Link from 'next/link';

const ProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        fetchBookings(user.uid);
      } else {
        setUserId(null);
        setBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchBookings = async (userId: string) => {
    const bookingsCollection = collection(db, "bookings");
    const q = query(bookingsCollection, where("userId", "==", userId));
    const bookingsSnapshot = await getDocs(q);
    const bookingsData = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Booking[];
    setBookings(bookingsData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Please log in to view your bookings.</div>;
  }

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

export default ProfilePage;