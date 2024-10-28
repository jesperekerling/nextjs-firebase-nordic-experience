'use client';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Package } from "@/types/package";

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPackage();
  }, []);

  const getPackage = async () => {
    try {
      if (typeof id !== 'string') {
        setError("Invalid package ID.");
        setLoading(false);
        return;
      }
      const docRef = doc(db, "packages", id as string);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {pkg?.images && pkg.images.length > 0 && (
        <>
          <img src={pkg.images[0]} alt="Package Image" className="w-2/3 h-2/3 object-cover mb-4 rounded" />
          {pkg.images.length > 1 && (
            <div className="flex space-x-2 mt-2">
              {pkg.images.slice(1).map((url, index) => (
                <img key={index} src={url} alt={`Thumbnail ${index}`} className="w-1/3 h-1/3 object-cover rounded cursor-pointer" />
              ))}
            </div>
          )}
        </>
      )}
      <h1 className="text-2xl font-bold mb-4">{pkg?.name}</h1>
      <p className="text-gray-500">Category: {pkg?.category}</p>
      <p className="text-gray-500">City: {pkg?.city}</p>
      <p>{pkg?.description}</p>
      <p className="text-gray-500">Price: ${pkg?.price}</p>
      <p className="text-gray-500">Days: {pkg?.days}</p>
      <div className="mt-2">
        <h3 className="font-semibold">Activities:</h3>
        <ul className="list-disc list-inside">
          {pkg?.activities && pkg.activities.length > 0 ? (
            pkg.activities.map((activity, index) => (
              <li key={index}>
                <strong>{activity.name}</strong>: {activity.description} ({activity.time})
              </li>
            ))
          ) : (
            <li>No activities available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PackageDetail;