'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handleConfirmBooking = async () => {
    try {
      for (const booking of cart) {
        const bookingData = { ...booking } as Partial<typeof booking>;
        delete bookingData.id; // Remove the id field before saving to Firestore

        await addDoc(collection(db, "bookings"), bookingData);

        // Calculate booking dates
        const bookingDates: string[] = [];
        const currentDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        while (currentDate <= endDate) {
          bookingDates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Update housing availability
        const housingRef = doc(db, "housing", booking.housingId);
        const housingDoc = await getDoc(housingRef);
        if (housingDoc.exists()) {
          const housingData = housingDoc.data();
          const updatedAvailability = [
            ...housingData.availability,
            ...bookingDates.map(date => ({ date, available: false }))
          ];

          await updateDoc(housingRef, { availability: updatedAvailability });
        }
      }

      clearCart();
      alert("Booking confirmed!");
      router.push('/profile');
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking.");
    }
  };

  if (cart.length === 0) {
    return <div>No items in the cart.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <ul>
        {cart.map((booking, index) => (
          <li key={index} className="mb-4">
            <p>Housing: {booking.housingId}</p>
            <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>Guests: {booking.guests}</p>
            <p>Total Price: ${booking.totalPrice}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmBooking} className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80 mt-5">
        Confirm Booking
      </button>
    </div>
  );
};

export default CheckoutPage;