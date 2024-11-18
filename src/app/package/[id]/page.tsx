'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Package } from "@/types/package";
import PackageDetailClient from "./PackageDetailClient";
import Link from "next/link";
import GoogleMaps from "@/components/GoogleMaps";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const docRef = doc(db, "packages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPkg({ id: docSnap.id, ...docSnap.data() } as Package);
        } else {
          setError("Package not found.");
        }
      } catch (error) {
        setError("Failed to fetch package.");
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const defaultLat = 55.672112;
  const defaultLng = 12.521130;
  const location = pkg?.location;

  const lat = location?.latitude || defaultLat;
  const lng = location?.longitude || defaultLng;

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <button className="bg-primary text-white py-2 px-3 rounded-lg font-semibold text-sm md:text-md hover:opacity-80">
          Back to packages
        </button>
      </Link>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-7 md:my-10">{pkg?.name}</h1>
      {pkg?.images && pkg.images.length > 0 && <PackageDetailClient images={pkg.images} />}
      <p className="mt-5">
        <button className="bg-primary text-white px-4 py-3 rounded-lg w-full font-semibold hover:opacity-80">
          Book now
        </button>
      </p>
      <div className="flex py-5">
        <p className="text-md md:text-lg flex-auto">{pkg?.description}</p>
        <p className="text-black flex-auto text-right font-bold px-1">${pkg?.price} per person</p>
      </div>
      <p className="my-5">
        <span className="bg-secondary text-black py-3 px-5 rounded-lg font-semibold">{pkg?.city}</span>
        <span className="bg-secondary text-black py-3 px-5 mx-4 rounded-lg font-semibold">{pkg?.category}</span>
        <span className="bg-secondary text-black py-3 px-5 rounded-lg my-5 font-semibold">{pkg?.days} days</span>
      </p>
      <div className="mt-2">
        <h2 className="font-semibold pt-5 pb-3 text-xl md:text-2xl">Activities</h2>
        <ul className="list-disc list-inside">
          {pkg?.activities && pkg.activities.length > 0 ? (
            pkg.activities.map((activity, index) => (
              <li key={index} className="py-3">
                <strong>{activity.name}</strong>
                <br />
                {activity.description} ({activity.time})
              </li>
            ))
          ) : (
            <li>No activities available.</li>
          )}
        </ul>
      </div>
      <GoogleMaps lat={lat} lng={lng} />
    </div>
  );
};

export default PackageDetail;