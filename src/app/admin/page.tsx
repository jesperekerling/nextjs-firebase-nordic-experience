'use client';
import { useEffect, useState } from "react";
import { fetchPackages } from "../../utils/fetchPackages";
import { Package } from "@/types/package";
import Link from 'next/link';
import Image from 'next/image';

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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
      <nav>
        <ul>
          <li>
            <Link href="/admin/housing">
              Housing list
            </Link>
          </li>
        </ul>
      </nav>
      <p className="pb-10 text-right">
        <Link href="/admin/add-images" className="bg-primary py-3 px-4 rounded-md text-white">
          Upload new images
        </Link>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages && packages.length > 0 ? (
          packages.map(pkg => (
            <div key={pkg.id} className="relative rounded">
              {pkg.images && pkg.images.length > 0 && isValidUrl(pkg.images[0]) && (
                <Image
                  src={pkg.images[0]}
                  alt={`Thumbnail of ${pkg.name}`}
                  width={600}
                  height={600}
                  className="w-full h-48 object-cover mb-1 rounded"
                />
              )}
              <h2 className="text-lg font-bold py-2">{pkg.name}</h2>
              <p className="text-sm truncate">{pkg.description}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400 pt-1">${pkg.price}/person - Days: {pkg.days}</p>
              <Link href={`/admin/packages/edit/${pkg.id}`} className="hover:opacity-65">
                <button className="mt-2 px-3 py-2 bg-primary text-white rounded">Edit</button>
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