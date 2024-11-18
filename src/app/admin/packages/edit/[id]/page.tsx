'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "../../../../../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { Package } from "../../../../../types/package";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import { onAuthStateChanged } from "firebase/auth";
import Link from 'next/link';
import Image from 'next/image';
import { GeoPoint } from "firebase/firestore";

const EditPackagePage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);
  const router = useRouter();

  const fetchImages = useCallback(async () => {
    try {
      const imagesRef = ref(storage, 'images/');
      const imagesList = await listAll(imagesRef);
      const urls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
      setImageList(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, []);

  useEffect(() => {
    const getPackage = async () => {
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getPackage();
        fetchImages();
      } else {
        setLoading(false);
        setError("User not authenticated.");
      }
    });

    return () => unsubscribe();
  }, [id, fetchImages]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    try {
      const docRef = doc(db, "packages", id);
      await updateDoc(docRef, { 
        ...pkg,
        location: new GeoPoint(pkg.location.latitude, pkg.location.longitude)
      });
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      const updatedLocation = { ...prevPkg.location, [name]: parseFloat(value) };
      return { ...prevPkg, location: updatedLocation };
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

  const handleAddImage = () => {
    setPkg(prevPkg => {
      if (!prevPkg) return null;
      const updatedImages = [...(prevPkg.images || []), ""];
      return { ...prevPkg, images: updatedImages };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!newImage) return;

    const storageRef = ref(storage, `package-images/${newImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPkg(prevPkg => {
            if (!prevPkg) return null;
            const updatedImages = [...(prevPkg.images || []), downloadURL];
            return { ...prevPkg, images: updatedImages };
          });
          alert('Upload successful!');
          fetchImages(); // Refresh the image list after upload
        });
      }
    );
  };

  const handleDeleteImage = async (index: number) => {
    if (!pkg) return;

    const updatedImages = pkg.images.filter((_, i) => i !== index);
    setPkg(prevPkg => prevPkg ? { ...prevPkg, images: updatedImages } : null);

    try {
      const docRef = doc(db, "packages", id);
      await updateDoc(docRef, { images: updatedImages });
    } catch (error) {
      console.error("Error deleting image:", error);
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
      <h1 className="text-2xl font-bold mb-4">Edit Package</h1>
      <p className='pb-10'>
        <Link href="/admin/">
          Back to package list
        </Link>
      </p>
      {pkg && (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <label className="font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={pkg.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">City</label>
          <input
            type="text"
            name="city"
            value={pkg.city}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Address</label>
          <input
            type="text"
            name="address"
            value={pkg.address}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Description</label>
          <textarea
            name="description"
            value={pkg.description}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Price Per Person</label>
          <input
            type="number"
            name="price"
            value={pkg.price}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Days</label>
          <input
            type="number"
            name="days"
            value={pkg.days}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <div className="mt-4">
            <h3 className="font-semibold">Location:</h3>
            <input
              type="number"
              name="latitude"
              value={pkg.location?.latitude || ""}
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded mb-2"
              placeholder="Latitude"
            />
            <input
              type="number"
              name="longitude"
              value={pkg.location?.longitude || ""}
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded mb-2"
              placeholder="Longitude"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Images:</h3>
            {pkg.images && pkg.images.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="p-2 border border-gray-300 rounded flex-1"
                />
                <Image
                  src={url}
                  alt={`Image ${index}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleOpenModal(index)}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="p-2 bg-green-500 text-white rounded mt-2"
            >
              Add New Image
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Upload New Image:</h3>
            <input type="file" onChange={handleImageChange} />
            <button type="button" onClick={handleUpload} className="p-2 bg-green-500 text-white rounded mt-2">Upload</button>
            <progress value={uploadProgress} max="100" className="w-full mt-2" />
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
      )}
      <ImageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        folderPath="package-images/"
        onSelectImage={handleImageSelect}
        imageList={imageList} // Pass imageList to ImageSelectorModal
      />
    </div>
  );
};

export default EditPackagePage;