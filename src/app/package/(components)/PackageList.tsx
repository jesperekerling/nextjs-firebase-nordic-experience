'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ThumbnailNavigator from "./ThumbnailNavigator";
import { Package } from "../../../types/package";

interface PackageListProps {
  packages: Package[];
  selectedCategory: string | null;
  selectedCity: string | null;
}

const PackageList: React.FC<PackageListProps> = ({ packages = [], selectedCategory: initialSelectedCategory, selectedCity: initialSelectedCity }) => {
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialSelectedCategory);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialSelectedCity);

  useEffect(() => {
    let filtered = packages;
    if (selectedCategory) {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }
    if (selectedCity) {
      filtered = filtered.filter(pkg => pkg.city === selectedCity);
    }
    setFilteredPackages(filtered);
  }, [selectedCategory, selectedCity, packages]);

  // Extract unique categories and cities
  const categories = Array.from(new Set(packages.map(pkg => pkg.category)));
  const cities = Array.from(new Set(packages.map(pkg => pkg.city)));

  return (
    <div className="md:w-full">
      <div className="py-2 overflow-x-auto hide-scrollbar">
        <div className="flex flex-nowrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 font-semibold text-sm py-2 m-2 rounded-lg ${selectedCategory === null ? 'bg-primary text-white' : 'bg-secondary text-gray-700'}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 font-semibold text-sm py-2 m-2 rounded-lg ${selectedCategory === category ? 'bg-primary text-white' : 'bg-secondary text-gray-700'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="py-2">
        <select
          value={selectedCity || ''}
          onChange={(e) => setSelectedCity(e.target.value || null)}
          className="border-black rounded-md px-3 py-2 m-2 text-sm text-black"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPackages && filteredPackages.length > 0 ? (
          filteredPackages.map((pkg, index) => (
            <div className="relative rounded" key={pkg.id}>
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
                <p className="text-sm">{pkg.description}</p>
                <p className="text-gray-500 text-sm dark:text-gray-400 pt-1">${pkg.price}/person - Days: {pkg.days}</p>
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