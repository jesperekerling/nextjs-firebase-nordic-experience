import React from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Package } from "@/types/package";
import { PackageBooking } from "@/types/packageBookings";
import PackageDetailClient from "./PackageDetailClient";
import Link from "next/link";
import GoogleMaps from "@/components/GoogleMaps";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docRef = doc(db, "packages", id);
  const docSnap = await getDoc(docRef);
  const pkg = docSnap.exists() ? (docSnap.data() as Package) : null;

  return {
    title: pkg ? `${pkg.name} - Nordic Experiences` : "Package not found - Nordic Experiences",
    description: pkg ? pkg.description : "Package not found",
  };
}

const PackageDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let pkg: Package | null = null;
  let error: string | null = null;

  try {
    const docRef = doc(db, "packages", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      pkg = {
        ...data,
        id, // Ensure the id property is defined
        location: {
          latitude: data.location._lat,
          longitude: data.location._long,
        },
      } as Package;
    } else {
      error = "Package not found.";
    }
  } catch (err) {
    error = "Failed to fetch package.";
    console.error("Error fetching package:", err);
  }

  if (error) {
    return <div>{error}</div>;
  }

  const defaultLat = 55.672112;
  const defaultLng = 12.521130;
  const location = pkg?.location;

  const lat = location?.latitude || defaultLat;
  const lng = location?.longitude || defaultLng;

  // Convert Package to PackageBooking type
  const packageDetail: PackageBooking = {
    ...pkg,
    id: id, // Ensure the id property is defined and not undefined
    packageId: id,
    userId: "", // Placeholder, will be set in the client component
    startDate: "", // Placeholder, will be set in the client component
    endDate: "", // Placeholder, will be set in the client component
    guests: 0, // Placeholder, will be set in the client component
    totalPrice: 0, // Placeholder, will be set in the client component
    images: pkg?.images || [], // Ensure images is defined and not undefined
    days: pkg?.days || 0, // Provide a default value for days
    price: pkg?.price || 0, // Provide a default value for price
  };

  return (
    <div>
      <Link href="/packages">
        <button className="bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm md:text-md hover:opacity-80">
          Back to packages list
        </button>
      </Link>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-7 md:my-10">{pkg?.name}</h1>
      {pkg?.images && pkg.images.length > 0 && <PackageDetailClient packageDetail={packageDetail} />}
      <div className="my-7 md:my-5 md:flex text-center">
        <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold">{pkg?.city}</span>
        <span className="bg-secondary text-black py-3 px-5 mx-4 rounded-lg font-semibold">Days: {pkg?.days}</span>
      </div>
      <p className="text-md md:text-lg flex-auto pb-5">{pkg?.description}</p>
      <h2 className="text-xl md:text-2xl font-bold mt-7 md:mt-10 mb-5">Activities</h2>
      <ul className="list-disc list-inside pb-5">
        {pkg?.activities.map((activity, index) => (
          <li key={index} className="text-md md:text-lg pb-5">
            <strong>{activity.name}</strong> <strong className="bg-secondary px-4 py-2 rounded-lg ml-3 text-sm">{activity.time}</strong><br />
            <p className="pt-2 pb-3">{activity.description}</p>
          </li>
        ))}
      </ul>
      <h2 className="text-xl md:text-2xl font-bold mt-7 md:mt-10 mb-5">Location</h2>
      <p className="pb-5">{pkg?.address}</p>
      <GoogleMaps lat={lat} lng={lng} />
    </div>
  );
};

export default PackageDetail;