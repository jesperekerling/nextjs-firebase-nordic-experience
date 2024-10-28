'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../../../firebase/firebaseConfig";
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { Package } from "../../../../../types/package";
import ImageSelectorModal from "@/components/ImageSelectorModal";

const EditPackage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    getPackage();
    fetchImages();
  }, []);

  const getPackage = async () => {
    try {
      if (!id) {
        setError("Invalid package ID.");
        setLoading(false);
        return;
      }
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

  const fetchImages = async () => {
    try {
      const imagesRef = ref(storage, 'images/');
      const imagesList = await listAll(imagesRef);
      const urls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
      setImageList(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    try {
      const docRef = doc(db, "packages", id);
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

  const handleImageSelect = (url: string) => {
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      if (selectedImageIndex !== null) {
        const updatedImages = [...(prevPkg.images || [])];
        updatedImages[selectedImageIndex] = url;
        return { ...prevPkg, images: updatedImages };
      }
      return prevPkg;
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
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
            name="name"
            value={pkg.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Name"
          />
          <input
            type="text"
            name="category"
            value={pkg.category}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Category"
          />
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
          <div className="mt-4">
            <h3 className="font-semibold">Images:</h3>
            {pkg.images && pkg.images.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleChange(e)}
                  className="p-2 border border-gray-300 rounded flex-1"
                />
                <img src={url} alt={`Image ${index}`} className="w-16 h-16 object-cover" />
                <button
                  type="button"
                  onClick={() => handleOpenModal(index)}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
      )}
      <ImageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageList={imageList}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};

export default EditPackage;