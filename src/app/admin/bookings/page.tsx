'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import Link from 'next/link';
import { Booking } from "@/types/bookings";
import { Housing } from "@/types/housing";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from 'next/image';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [housingDetails, setHousingDetails] = useState<{ [key: string]: Housing }>({});
  const [userDetails, setUserDetails] = useState<{ [key: string]: { name: string } }>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          setIsAdmin(true);
          fetchBookings();
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchBookings = async () => {
    const bookingsCollection = collection(db, "bookings");
    const bookingsSnapshot = await getDocs(bookingsCollection);
    const bookingsData = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Booking[];
    setBookings(bookingsData);

    // Fetch housing details for each booking
    const housingDetails: { [key: string]: Housing } = {};
    const userDetails: { [key: string]: { name: string } } = {};
    for (const booking of bookingsData) {
      const housingRef = doc(db, "housing", booking.housingId);
      const housingDoc = await getDoc(housingRef);
      if (housingDoc.exists()) {
        housingDetails[booking.housingId] = housingDoc.data() as Housing;
      }

      const userRef = doc(db, "users", booking.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        userDetails[booking.userId] = userDoc.data() as { name: string };
      }
    }
    setHousingDetails(housingDetails);
    setUserDetails(userDetails);
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const bookingToDelete = bookings.find(booking => booking.id === id);
      if (!bookingToDelete) {
        alert("Booking not found.");
        return;
      }

      // Delete the booking
      await deleteDoc(doc(db, "bookings", id));
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));

      // Update housing availability
      const housingRef = doc(db, "housing", bookingToDelete.housingId);
      const housingDoc = await getDoc(housingRef);
      if (housingDoc.exists()) {
        const housingData = housingDoc.data() as Housing;
        const updatedAvailability = housingData.availability.map((avail: { date: string; available: boolean }) => {
          if (new Date(avail.date) >= new Date(bookingToDelete.startDate) && new Date(avail.date) <= new Date(bookingToDelete.endDate)) {
            return { ...avail, available: true };
          }
          return avail;
        });

        await updateDoc(housingRef, { availability: updatedAvailability });
      }

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      <ul>
        {bookings.map(booking => {
          const housing = housingDetails[booking.housingId];
          const user = userDetails[booking.userId];
          return (
            <li key={booking.id} className="mb-4">
              {housing && housing.images && housing.images.length > 0 && (
                <Link href={`/housing/${booking.housingId}`} className="rounded hover:opacity-75">
                  <Image src={housing.images[0]} alt={housing.name} width={300} height={300} className="object-cover rounded" />
                </Link>
              )}
              <p className="font-bold"><Link href={`/housing/${booking.housingId}`}>{housing ? housing.name : booking.housingId}</Link></p>
              <p>City: {housing?.city}</p>
              <p>User: {user ? user.name : booking.userId}</p>
              <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
              <p>Guests: {booking.guests}</p>
              <p>Total Price: ${booking.totalPrice}</p>
              <p>
                <Link href={`/housing/${booking.housingId}`} className="bg-primary text-white px-3 py-2 rounded hover:opacity-75">
                  View Housing
                </Link>
                <button
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="ml-4 bg-secondary text-black px-3 py-1 rounded"
                >
                  Delete
                </button>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminBookingsPage;