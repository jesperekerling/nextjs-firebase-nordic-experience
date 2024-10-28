'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../firebase/firebaseConfig";
import { Package } from "../../../../../types/package";

const EditPackage = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getPackage();
  }, []);

  const getPackage = async () => {
    try {
      if (!id) {
        setError("Invalid package ID.");
        setLoading(false);
        return;
      }
      const docRef = doc(db, "packages", Array.isArray(id) ? id[0] : id);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    try {
      if (!id) {
        throw new Error("Package ID is undefined.");
      }
      const docRef = doc(db, "packages", Array.isArray(id) ? id[0] : id);
      await updateDoc(docRef, { ...pkg });
      router.push('/admin/packages');
    } catch (error) {
      setError("Failed to update package.");
      console.error("Error updating package:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPkg(prevPkg => prevPkg ? { ...prevPkg, [name]: value } : null);
  };

  const handleActivityChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      const updatedActivities = [...prevPkg.activities];
      updatedActivities[index] = { ...updatedActivities[index], [name]: value };
      return { ...prevPkg, activities: updatedActivities };
    });
  };

  const handleAddActivity = () => {
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      const newActivity = { name: "", description: "", time: "" };
      return { ...prevPkg, activities: [...prevPkg.activities, newActivity] };
    });
  };

  const handleRemoveActivity = (index: number) => {
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      const updatedActivities = prevPkg.activities.filter((_, i) => i !== index);
      return { ...prevPkg, activities: updatedActivities };
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Package</h1>
      {pkg && (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={pkg.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Name"
            />
          </div>
          <div>
            <label htmlFor="category" className="block font-semibold">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={pkg.category}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Category"
            />
          </div>
          <div>
            <label htmlFor="city" className="block font-semibold">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={pkg.city}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={pkg.description}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Description"
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-semibold">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={pkg.price}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Price"
            />
          </div>
          <div>
            <label htmlFor="days" className="block font-semibold">Days</label>
            <input
              type="number"
              id="days"
              name="days"
              value={pkg.days}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Days"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Activities:</h3>
            {pkg.activities.map((activity, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <input
                  type="text"
                  name="name"
                  value={activity.name}
                  onChange={(e) => handleActivityChange(index, e)}
                  className="p-2 border border-gray-300 rounded mb-2"
                  placeholder="Activity Name"
                />
                <textarea
                  name="description"
                  value={activity.description}
                  onChange={(e) => handleActivityChange(index, e)}
                  className="p-2 border border-gray-300 rounded mb-2"
                  placeholder="Activity Description"
                />
                <input
                  type="text"
                  name="time"
                  value={activity.time}
                  onChange={(e) => handleActivityChange(index, e)}
                  className="p-2 border border-gray-300 rounded mb-2"
                  placeholder="Activity Time"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(index)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Remove Activity
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddActivity}
              className="p-2 bg-green-500 text-white rounded"
            >
              Add Activity
            </button>
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
      )}
    </div>
  );
};

export default EditPackage;