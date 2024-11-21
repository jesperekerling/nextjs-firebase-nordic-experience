'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Booking } from "@/types/bookings";
import { PackageBooking } from "@/types/packageBookings";
import { Housing } from "@/types/housing";
import { Package } from "@/types/package";
import Link from 'next/link';
import Image from 'next/image';

const ProfilePage = () => {
  const [bookings, setBookings] = useState<(Booking | PackageBooking)[]>([]);
  const [housingDetails, setHousingDetails] = useState<{ [key: string]: Housing }>({});
  const [packageDetails, setPackageDetails] = useState<{ [key: string]: Package }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchBookings(user.uid);
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
    })) as (Booking | PackageBooking)[];
    setBookings(bookingsData);

    // Fetch housing and package details for each booking
    const housingDetails: { [key: string]: Housing } = {};
    const packageDetails: { [key: string]: Package } = {};
    for (const booking of bookingsData) {
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
        {bookings.map(booking => {
          if ('housingId' in booking) {
            const housing = housingDetails[booking.housingId];
            return (
              <li key={booking.id} className="mb-4">
                <div className="flex gap-5">
                  <div>
                    {housing && housing.images && housing.images.length > 0 && (
                      <Link href={`/housing/${booking.housingId}`} className="rounded hover:opacity-75">
                        <Image src={housing.images[0]} alt={housing.name} width={300} height={300} className="object-cover aspect-square rounded" />
                      </Link>
                    )}
                  </div>
                  <div className="items-center justify-center">
                    <p className="font-bold my-3"><Link href={`/housing/${booking.housingId}`}>{housing ? housing.name : booking.housingId}</Link></p>
                    <p>City: {housing?.city}</p>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                    <p className="py-3">
                      <Link href={`/housing/${booking.housingId}`} className="bg-primary text-white px-3 py-2 rounded hover:opacity-75 text-sm">
                        View Housing
                      </Link>
                      </p>
                  </div>
                </div>
              </li>
            );
          } else if ('packageId' in booking) {
            const pkg = packageDetails[booking.packageId];
            return (
              <li key={booking.id} className="mb-4">
                <div className="flex gap-5">
                  <div>
                    {pkg && pkg.images && pkg.images.length > 0 && (
                      <Link href={`/package/${booking.packageId}`} className="rounded hover:opacity-75">
                        <Image src={pkg.images[0]} alt={pkg.name} width={300} height={300} className="object-cover aspect-square rounded" />
                      </Link>
                    )}
                  </div>
                  <div className="items-center justify-center">
                    <p className="font-bold my-3"><Link href={`/packages/${booking.packageId}`}>{pkg ? pkg.name : booking.packageId}</Link></p>
                    <p>City: {pkg?.city}</p>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                    <p className="py-3">
                      <Link href={`/package/${booking.packageId}`} className="bg-primary text-white px-3 py-2 rounded hover:opacity-75 text-sm">
                        View Package
                      </Link>
                    </p>
                  </div>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default ProfilePage;