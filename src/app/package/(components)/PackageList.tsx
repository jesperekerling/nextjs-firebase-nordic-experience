'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ThumbnailNavigator from "./ThumbnailNavigator";
import { Package } from "../../../types/package";

interface PackageListProps {
  packages: Package[];
  selectedCategory: string | null;
}

const PackageList: React.FC<PackageListProps> = ({ packages = [], selectedCategory: initialSelectedCategory }) => {
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPackages(packages.filter(pkg => pkg.category === selectedCategory));
    } else {
      setFilteredPackages(packages);
    }
  }, [selectedCategory, packages]);

  // Extract unique categories
  const categories = Array.from(new Set(packages.map(pkg => pkg.category)));

  return (
    <div>
      <div className="max-w-72 md:w-full">
        <div className="overflow-x-auto py-2">
          <div className="inline-flex whitespace-nowrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-block px-4 py-2 m-2 rounded-lg ${selectedCategory === null ? 'bg-primary text-white' : 'bg-secondary text-gray-700'}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-block px-4 py-2 m-2 rounded-lg ${selectedCategory === category ? 'bg-primary text-white' : 'bg-secondary text-gray-700'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages && filteredPackages.length > 0 ? (
          filteredPackages.map((pkg, index) => (
            <div className="relative p-4 rounded" key={pkg.id}>
              {pkg.images && pkg.images.length > 0 && (
                <ThumbnailNavigator
                  images={pkg.images.map(url => url.startsWith('http') ? url : `/${url}`)}
                  altText={`Image for ${pkg.name}`}
                  category={pkg.category} // Pass category prop
                  isAboveFold={index < 3} // Assume the first 3 packages are above the fold
                />
              )}
              <Link href={`/package/${pkg.id}`} className="hover:opacity-65">
                <h2 className="text-lg font-bold py-3">{pkg.name}</h2>
                <p className="text-gray-500 text-sm"></p>
                <p className="text-sm">{pkg.description}</p>
                <p className="text-gray-500 text-sm">${pkg.price}/person - Days: {pkg.days}</p>
                <div className="mt-2 text-xs">
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

export default PackageList;