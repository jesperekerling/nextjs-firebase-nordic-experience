'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Housing } from "@/types/housing";
import { Package } from "@/types/package";
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart, removeFromCart } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [housingDetails, setHousingDetails] = useState<{ [key: string]: Housing }>({});
  const [packageDetails, setPackageDetails] = useState<{ [key: string]: Package }>({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    const fetchDetails = async () => {
      const housingDetails: { [key: string]: Housing } = {};
      const packageDetails: { [key: string]: Package } = {};

      for (const booking of cart) {
        if ('housingId' in booking) {
          const housingRef = doc(db, "housing", booking.housingId);
          const housingDoc = await getDoc(housingRef);
          if (housingDoc.exists()) {
            housingDetails[booking.housingId] = housingDoc.data() as Housing;
          }
        } else if ('packageId' in booking) {
          const packageRef = doc(db, "packages", booking.packageId);
          const packageDoc = await getDoc(packageRef);
          if (packageDoc.exists()) {
            packageDetails[booking.packageId] = packageDoc.data() as Package;
          }
        }
      }

      setHousingDetails(housingDetails);
      setPackageDetails(packageDetails);
    };

    fetchDetails();

    return () => unsubscribe();
  }, [cart]);

  const handleConfirmBooking = async () => {
    if (!userId) {
      toast("Please log in to confirm your order.");
      router.push('/login');
      return;
    }

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
        if ('housingId' in booking) {
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
      }

      clearCart();
      toast.success("Booking confirmed!");
      router.push('/profile');
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast("Failed to confirm booking.");
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
            {'housingId' in booking ? (
              <>
                <div className="flex gap-5">
                  <div>
                    {housingDetails[booking.housingId] && housingDetails[booking.housingId].images && housingDetails[booking.housingId].images.length > 0 && (
                      <Link href={`/housing/${booking.housingId}`} className="rounded hover:opacity-75">
                        <Image src={housingDetails[booking.housingId].images[0]} alt={housingDetails[booking.housingId].name} width={200} height={200} className="object-cover aspect-square rounded" />
                      </Link>
                    )}
                  </div>
                  <div>
                    <p className="font-bold my-3"><Link href={`/housing/${booking.housingId}`}>{housingDetails[booking.housingId] ? housingDetails[booking.housingId].name : booking.housingId}</Link></p>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-5">
                  <div>
                    {packageDetails[booking.packageId] && packageDetails[booking.packageId].images && packageDetails[booking.packageId].images.length > 0 && (
                      <Link href={`/packages/${booking.packageId}`} className="rounded hover:opacity-75">
                        <Image src={packageDetails[booking.packageId].images[0]} alt={packageDetails[booking.packageId].name} width={200} height={200} className="object-cover aspect-square rounded" />
                      </Link>
                    )}
                  </div>
                  <div>
                    <p className="font-bold my-3"><Link href={`/packages/${booking.packageId}`}>{packageDetails[booking.packageId] ? packageDetails[booking.packageId].name : booking.packageId}</Link></p>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                  </div>
                </div>
              </>
            )}
            <button onClick={() => removeFromCart(booking.id)} className="bg-primary text-white px-3 my-1 py-1 rounded">
              Delete
            </button>
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