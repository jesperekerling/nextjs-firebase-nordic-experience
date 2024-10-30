'use client';
import { useEffect, useState } from "react";
import { fetchPackages } from "../../utils/fetchPackages";
import { Package } from "../../types/package";
import Link from 'next/link';

const AdminPackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const packagesData = await fetchPackages();
      setPackages(packagesData);
    } catch (error) {
      setError("Failed to fetch packages.");
      console.error("Error fetching packages:", error);
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
      <h1 className="text-2xl font-bold mb-4">Admin Packages</h1>
      <p className="pb-10 text-right">
        <Link href="/admin/add-images" className="bg-primary py-3 px-4 rounded-md text-white">
          Upload new images
        </Link>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages && packages.length > 0 ? (
          packages.map(pkg => (
            <div key={pkg.id} className="border p-4 rounded shadow">
              {pkg.images && pkg.images.length > 0 && (
                <img src={pkg.images[0]} alt="Package Image" className="w-full h-1/3 object-cover mb-4 rounded" />
              )}
              <h2 className="text-xl font-bold">{pkg.name}</h2>
              <p className="text-gray-500">Category: {pkg.category}</p>
              <p className="text-gray-500">City: {pkg.city}</p>
              <p>{pkg.description}</p>
              <p className="text-gray-500">Price: ${pkg.price}</p>
              <p className="text-gray-500">Days: {pkg.days}</p>
              <div className="mt-2">
                <h3 className="font-semibold">Activities:</h3>
                <ul className="list-disc list-inside">
                  {pkg.activities && pkg.activities.length > 0 ? (
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
              <Link href={`/admin/packages/edit/${pkg.id}`}>
                <button className="mt-4 p-2 bg-blue-500 text-white rounded">Edit</button>
              </Link>
            </div>
          ))
        ) : (
          <div>No packages available.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPackagesPage;