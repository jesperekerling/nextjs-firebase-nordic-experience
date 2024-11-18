'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "../../../../../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { Housing } from "../../../../../types/housing";
import ImageSelectorModal from "@/components/ImageSelectorModal";
import { onAuthStateChanged } from "firebase/auth";
import Link from 'next/link';
import Image from 'next/image'; // Ensure this import is correct
import { GeoPoint } from "firebase/firestore";

const EditHousingPage = () => {
  const { id } = useParams<{ id: string }>(); // Ensure useParams is correctly typed
  const [housing, setHousing] = useState<Housing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getHousing();
        fetchImages();
      } else {
        setLoading(false);
        setError("User not authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  const getHousing = async () => {
    try {
      if (!id) {
        setError("Invalid housing ID.");
        setLoading(false);
        return;
      }
      const docRef = doc(db, "housing", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHousing({ id: docSnap.id, ...docSnap.data() } as Housing);
      } else {
        setError("Housing not found.");
      }
    } catch (error) {
      setError("Failed to fetch housing.");
      console.error("Error fetching housing:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const imagesRef = ref(storage, 'housing-images/');
      const imagesList = await listAll(imagesRef);
      const urls = await Promise.all(imagesList.items.map(item => getDownloadURL(item)));
      // Use the imageList if needed, otherwise remove this comment
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!housing) return;

    try {
      const docRef = doc(db, "housing", id);
      await updateDoc(docRef, { 
        ...housing,
        location: new GeoPoint(housing.location.latitude, housing.location.longitude)
      });
      router.push('/admin/housing');
    } catch (error) {
      setError("Failed to update housing.");
      console.error("Error updating housing:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHousing(prevHousing => prevHousing ? { ...prevHousing, [name]: value } : null);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedLocation = { ...prevHousing.location, [name]: parseFloat(value) };
      return { ...prevHousing, location: updatedLocation };
    });
  };

  const handleAvailabilityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedAvailability = [...prevHousing.availability];
      updatedAvailability[index] = { ...updatedAvailability[index], [name]: name === 'available' ? value === 'true' : value };
      return { ...prevHousing, availability: updatedAvailability };
    });
  };

  const handleAddAvailability = () => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const newAvailability = { date: "", available: false };
      return { ...prevHousing, availability: [...prevHousing.availability, newAvailability] };
    });
  };

  const handleRemoveAvailability = (index: number) => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedAvailability = prevHousing.availability.filter((_, i) => i !== index);
      return { ...prevHousing, availability: updatedAvailability };
    });
  };

  const handleImageSelect = (url: string) => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      if (selectedImageIndex !== null) {
        const updatedImages = [...(prevHousing.images || [])];
        updatedImages[selectedImageIndex] = url;
        return { ...prevHousing, images: updatedImages };
      }
      return prevHousing;
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    setHousing(prevHousing => {
      if (!prevHousing) return null;
      const updatedImages = [...(prevHousing.images || []), ""];
      return { ...prevHousing, images: updatedImages };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!newImage) return;

    const storageRef = ref(storage, `housing-images/${newImage.name}`);
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
          setHousing(prevHousing => {
            if (!prevHousing) return null;
            const updatedImages = [...(prevHousing.images || []), downloadURL];
            return { ...prevHousing, images: updatedImages };
          });
          alert('Upload successful!');
          fetchImages(); // Refresh the image list after upload
        });
      }
    );
  };

  const handleDeleteImage = async (index: number) => {
    if (!housing) return;

    const updatedImages = housing.images.filter((_, i) => i !== index);
    setHousing(prevHousing => prevHousing ? { ...prevHousing, images: updatedImages } : null);

    try {
      const docRef = doc(db, "housing", id);
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
      <h1 className="text-2xl font-bold mb-4">Edit Housing</h1>
      <p className='pb-10'>
        <Link href="/admin/housing">
          Back to housing list
        </Link>
      </p>
      {housing && (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <label className="font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={housing.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">City</label>
          <input
            type="text"
            name="city"
            value={housing.city}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Address</label>
          <input
            type="text"
            name="address"
            value={housing.address}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Description</label>
          <textarea
            name="description"
            value={housing.description}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Price Per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={housing.pricePerNight}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <label className="mt-4 font-bold">Max Guests</label>
          <input
            type="number"
            name="maxGuests"
            value={housing.maxGuests ?? ''}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <div className="mt-4">
            <h3 className="font-semibold">Location:</h3>
            <input
              type="number"
              name="latitude"
              value={housing.location?.latitude || ""}
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded mb-2"
              placeholder="Latitude"
            />
            <input
              type="number"
              name="longitude"
              value={housing.location?.longitude || ""}
              onChange={handleLocationChange}
              className="p-2 border border-gray-300 rounded mb-2"
              placeholder="Longitude"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Availability:</h3>
            {housing.availability.map((availability, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <input
                  type="date"
                  name="date"
                  value={availability.date}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  className="p-2 border border-gray-300 rounded mb-2"
                  placeholder="Date"
                />
                <input
                  type="checkbox"
                  name="available"
                  checked={availability.available}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  className="p-2 border border-gray-300 rounded mb-2"
                  placeholder="Available"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAvailability(index)}
                  className="p-2 bg-primary text-white rounded"
                >
                  Remove Availability
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAvailability}
              className="p-2 bg-primary text-white rounded"
            >
              Add Availability
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Images:</h3>
            {housing.images && housing.images.map((url, index) => (
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
                  className="p-2 bg-primary text-white rounded"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-2 bg-secondary text-black rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="p-2 bg-primary text-white rounded mt-2"
            >
              Add New Image
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Upload New Image:</h3>
            <input type="file" onChange={handleImageChange} />
            <button type="button" onClick={handleUpload} className="p-2 bg-primary text-white rounded mt-2">Upload</button>
            <progress value={uploadProgress} max="100" className="w-full mt-2" />
          </div>
          <button type="submit" className="p-2 bg-primary text-white rounded">Save</button>
        </form>
      )}
      <ImageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        folderPath="housing-images/"
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};

export default EditHousingPage;