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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    try {
      const docRef = doc(db, "packages", id as string);
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
          <input
            type="text"
            name="city"
            value={pkg.city}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="City"
          />
          <textarea
            name="description"
            value={pkg.description}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Description"
          />
          <input
            type="number"
            name="price"
            value={pkg.price}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Price"
          />
          <input
            type="number"
            name="days"
            value={pkg.days}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Days"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
      )}
    </div>
  );
};

export default EditPackage;